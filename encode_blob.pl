#!/usr/bin/perl
use strict;
use warnings;
use JSON::PP;
use MIME::Base64 qw(encode_base64);

my $file = $ARGV[0] or die "Usage: $0 <file>\n";
open my $fh, "<", $file or die "Cannot open $file: $!";
binmode $fh;
my $data = do { local $/; <$fh> };
close $fh;

print encode_json({
    content  => encode_base64($data, ""),
    encoding => "base64"
});
