#!/usr/bin/perl
use strict;
use warnings;
use IO::Socket::IP;
use File::Spec;
use Cwd 'abs_path';

$| = 1;
$SIG{CHLD} = 'IGNORE';

use FindBin qw($RealBin);
my $PORT = 8000;
my $DOC_ROOT = -f "$RealBin/index.html" ? abs_path($RealBin) :
               -f "$RealBin/../index.html" ? abs_path("$RealBin/..") :
               abs_path('/Users/michelebizzotto/blooming_site');

my %MIME = (
    'html'  => 'text/html; charset=utf-8',
    'htm'   => 'text/html; charset=utf-8',
    'css'   => 'text/css; charset=utf-8',
    'js'    => 'application/javascript; charset=utf-8',
    'json'  => 'application/json; charset=utf-8',
    'webp'  => 'image/webp',
    'jpg'   => 'image/jpeg',
    'jpeg'  => 'image/jpeg',
    'png'   => 'image/png',
    'gif'   => 'image/gif',
    'svg'   => 'image/svg+xml',
    'ico'   => 'image/x-icon',
    'woff'  => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf'   => 'font/ttf',
    'otf'   => 'font/otf',
    'xml'   => 'application/xml',
    'txt'   => 'text/plain; charset=utf-8',
);

my $server = IO::Socket::IP->new(
    LocalPort => $PORT,
    Proto     => 'tcp',
    Listen    => 128,
    ReuseAddr => 1
) or die "Cannot bind socket on port $PORT: $!\n";

print "==> Blooming Live Server on http://localhost:$PORT/\n";
print "==> Serving root: $DOC_ROOT\n";

while (my $client = $server->accept()) {
    my $pid = fork();
    if (!defined $pid) {
        close $client;
        next;
    }
    if ($pid == 0) {
        close $server;
        binmode($client);
        $client->autoflush(1);
        $SIG{ALRM} = sub { exit 0; };
        alarm(10);

        my $request_line = <$client>;
        exit 0 unless defined $request_line;

        while (my $line = <$client>) {
            $line =~ s/\r?\n$//;
            last if $line eq '';
        }

        if ($request_line =~ /^(GET|HEAD)\s+(\S+)\s+HTTP/) {
            my ($method, $uri) = ($1, $2);
            $uri =~ s/\?.*$//;
            $uri =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
            $uri = '/index.html' if $uri eq '/' || $uri eq '';

            my $subpath = File::Spec->canonpath($uri);
            $subpath =~ s/^\/+//;
            my $full = File::Spec->catfile($DOC_ROOT, $subpath);
            my $real = eval { abs_path($full) };

            if (!($real && -f $real)) {
                for my $subdir (qw(img data scripts css js)) {
                    my $candidate = eval { abs_path(File::Spec->catfile($DOC_ROOT, $subdir, $subpath)) };
                    if ($candidate && -f $candidate && index($candidate, $DOC_ROOT) == 0) {
                        $real = $candidate;
                        last;
                    }
                }
            }

            if ($real && -f $real && index($real, $DOC_ROOT) == 0) {
                my ($ext) = $real =~ /\.([^.]+)$/;
                $ext = lc($ext || '');
                my $mime = $MIME{$ext} || 'application/octet-stream';
                my $size = -s $real;

                if (open my $fh, '<:raw', $real) {
                    print $client "HTTP/1.1 200 OK\r\n";
                    print $client "Content-Type: $mime\r\n";
                    print $client "Content-Length: $size\r\n";
                    print $client "Connection: close\r\n";
                    print $client "Access-Control-Allow-Origin: *\r\n";
                    print $client "Cache-Control: no-cache\r\n\r\n";

                    if ($method eq 'GET') {
                        my $buf;
                        while (my $bytes = read($fh, $buf, 65536)) {
                            print $client $buf;
                        }
                    }
                    close $fh;
                } else {
                    print $client "HTTP/1.1 500 Internal Error\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
                }
            } else {
                my $msg = "404 Not Found\n";
                print $client "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: " . length($msg) . "\r\nConnection: close\r\n\r\n$msg";
            }
        }
        close $client;
        exit 0;
    }
    close $client;
}
