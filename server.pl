#!/usr/bin/perl
use strict;
use warnings;
use IO::Socket::INET;
use POSIX ":sys_wait_h";

$| = 1; # Autoflush
$SIG{PIPE} = 'IGNORE';
$SIG{CHLD} = 'IGNORE';

my $port = 8000;
my $dir  = '/Users/michelebizzotto/Desktop/cartella senza nome';

my $server = IO::Socket::INET->new(
    LocalAddr => '127.0.0.1',
    LocalPort => $port,
    Proto     => 'tcp',
    Listen    => 30,
    ReuseAddr => 1
) or die "Cannot create socket on port $port: $!\n";

print "BLOOMING Live Server running at http://localhost:$port/\n";

my %mimes = (
    'html' => 'text/html; charset=utf-8',
    'htm'  => 'text/html; charset=utf-8',
    'css'  => 'text/css',
    'js'   => 'application/javascript',
    'jpg'  => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png'  => 'image/png',
    'gif'  => 'image/gif',
    'svg'  => 'image/svg+xml',
    'webp' => 'image/webp',
    'json' => 'application/json'
);

sub get_latest_mtime {
    my $latest = 0;
    opendir(my $dh, $dir) or return 0;
    while (my $file = readdir($dh)) {
        next if $file =~ /^\./ || $file =~ /\.log$/ || $file eq 'server.pl';
        my $path = "$dir/$file";
        my $mtime = (stat($path))[9] || 0;
        $latest = $mtime if $mtime > $latest;
    }
    closedir($dh);
    return $latest;
}

while (my $client = $server->accept()) {
    my $pid = fork();
    if (!defined $pid) {
        warn "Cannot fork: $!\n";
        close($client);
        next;
    }

    if ($pid == 0) {
        # Child process
        $client->autoflush(1);
        my $request_line = <$client>;
        exit(0) unless $request_line;

        my ($method, $uri) = split(/\s+/, $request_line);
        # Read headers
        while (my $h = <$client>) {
            last if $h =~ /^\r?\n$/;
        }

        # URL Decode
        $uri =~ s/\?.*$//;
        $uri =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;

        if ($uri eq '/live-reload') {
            print $client "HTTP/1.1 200 OK\r\n";
            print $client "Content-Type: text/event-stream\r\n";
            print $client "Cache-Control: no-cache\r\n";
            print $client "Connection: keep-alive\r\n";
            print $client "Access-Control-Allow-Origin: *\r\n\r\n";
            print $client "data: connected\n\n";

            my $start_time = get_latest_mtime();
            for (1..150) {
                select(undef, undef, undef, 0.4);
                my $current = get_latest_mtime();
                if ($current > $start_time) {
                    print $client "data: reload\n\n";
                    last;
                }
                if ($_ % 30 == 0) {
                    print $client ": ping\n\n";
                }
            }
            close($client);
            exit(0);
        }

        $uri = '/index.html' if $uri eq '/' || $uri eq '';
        $uri =~ s/^\///;
        my $file_path = "$dir/$uri";

        if (!-f $file_path) {
            print $client "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\n\r\nNot Found";
            close($client);
            exit(0);
        }

        my ($ext) = $file_path =~ /\.([a-zA-Z0-9]+)$/;
        $ext = lc($ext || '');
        my $content_type = $mimes{$ext} || 'application/octet-stream';
        my $file_size = -s $file_path;

        if ($ext eq 'html' || $ext eq 'htm') {
            open(my $fh, '<:raw', $file_path);
            my $content = do { local $/; <$fh> };
            close($fh);

            my $live_script = q{
<script>
(function() {
    function connect() {
        var es = new EventSource('/live-reload');
        es.onmessage = function(e) {
            if (e.data === 'reload') {
                console.log('[LiveReload] Rilevata modifica ai file. Ricaricamento...');
                location.reload();
            }
        };
        es.onerror = function() {
            es.close();
            setTimeout(connect, 800);
        };
    }
    connect();
})();
</script>
};
            $content =~ s/<\/body>/$live_script<\/body>/i;
            my $len = length($content);

            print $client "HTTP/1.1 200 OK\r\n";
            print $client "Content-Type: $content_type\r\n";
            print $client "Content-Length: $len\r\n";
            print $client "Connection: close\r\n\r\n";
            print $client $content;
        } else {
            print $client "HTTP/1.1 200 OK\r\n";
            print $client "Content-Type: $content_type\r\n";
            print $client "Content-Length: $file_size\r\n";
            print $client "Connection: close\r\n\r\n";

            open(my $fh, '<:raw', $file_path);
            binmode($client);
            my $buffer;
            while (my $bytes = read($fh, $buffer, 65536)) {
                print $client $buffer;
            }
            close($fh);
        }

        close($client);
        exit(0);
    }

    # Parent process
    close($client);
}
