#!/usr/bin/perl
use strict;
use warnings;
use JSON::PP;
use Text::ParseWords;

$| = 1;

my $csv_file = "CATALOGO_TESSUTI_BLOOMING.csv";
if (!-f $csv_file) {
    die "Errore: File $csv_file non trovato nella cartella!\n";
}

print "1. Leggo $csv_file...\n";
open(my $fh, "<:encoding(UTF-8)", $csv_file) or die "Cannot open $csv_file: $!\n";

my $header_line = <$fh>;
$header_line =~ s/^\x{FEFF}//; # Rimuovi BOM
my @headers = quotewords(',', 0, $header_line);
s/^\s+|\s+$//g for @headers;

my @items = ();

while (my $line = <$fh>) {
    next if $line =~ /^\s*$/;
    my @fields = quotewords(',', 0, $line);
    s/^\s+|\s+$//g for @fields;

    my %row = ();
    for (my $i = 0; $i < @headers; $i++) {
        $row{$headers[$i]} = $fields[$i] // "";
    }

    my $code       = $row{Codice_Articolo} || "";
    my $name       = $row{Nome_Tessuto} || "";
    next unless $code || $name;

    my $macro      = $row{Macro_Categoria} || "Tessuti";
    my $collection = $row{Collezione} || "BLOOMING";
    my $comp       = $row{Composizione} || "";
    my $height     = $row{Altezza} || "";
    my $weight     = $row{Peso} || "";
    my $martindale = $row{Martindale} || "";
    my $shrinking  = $row{Restringimento} || "";
    my $img        = $row{Foto_Copertina_URL} || "";
    my $is_new     = ($row{Novita} && $row{Novita} =~ /^(SI|TRUE|1)$/i) ? JSON::PP::true : JSON::PP::false;

    my @uses       = split(/\s*,\s*/, $row{Destinazioni_Uso} || "");
    my @fibers     = split(/\s*,\s*/, $row{Fibre} || "");
    my @typologies = split(/\s*,\s*/, $row{Tipologie} || "");
    my @patterns   = split(/\s*,\s*/, $row{Disegni} || "");
    my @functions  = split(/\s*,\s*/, $row{Funzioni} || "");

    # Se usa Macro_Categoria Tende ma non e specificato in uses, aggiungilo
    if ($macro =~ /Tende/i && !grep { /^Tende$/i } @uses) {
        unshift @uses, "Tende";
    }

    # Ricostruisci varianti da Varianti_e_Foto_URL
    my @variants = ();
    my $var_raw = $row{Varianti_e_Foto_URL} || "";
    if ($var_raw) {
        for my $chunk (split(/\s*\|\s*/, $var_raw)) {
            if ($chunk =~ /^\s*([^:]+)\s*:\s*(.*?)\s*$/) {
                my $v_code = $1;
                my $v_img  = $2;
                push @variants, {
                    code => $v_code,
                    name => "${code}.${v_code}",
                    img  => $v_img
                };
            }
        }
    }

    # Se non c'erano foto specifiche per le varianti ma ci sono codici varianti
    if (!@variants && $row{Codici_Varianti}) {
        for my $v_code (split(/\s*,\s*/, $row{Codici_Varianti})) {
            push @variants, {
                code => $v_code,
                name => "${code}.${v_code}",
                img  => $img
            };
        }
    }

    my %item = (
        code       => $code,
        name       => $name,
        collection => $collection,
        comp       => $comp,
        height     => $height,
        weight     => $weight,
        martindale => $martindale,
        shrinking  => $shrinking,
        uses       => \@uses,
        fibers     => \@fibers,
        typologies => \@typologies,
        patterns   => \@patterns,
        functions  => \@functions,
        is_new     => $is_new,
        img        => $img,
        variants   => \@variants
    );

    push @items, \%item;
}
close($fh);

my $total = scalar(@items);
print "Caricati $total articoli dal CSV.\n";

my $coder = JSON::PP->new->utf8->canonical;
my $json_output = $coder->encode(\@items);

# Aggiorna index.html e Blooming_Sito_Ufficiale_V11.html
for my $target_file ("index.html", "Blooming_Sito_Ufficiale_V11.html") {
    if (-f $target_file) {
        print "Aggiorno $target_file...\n";
        open(my $in, "<:raw", $target_file) or die $!;
        my $content = do { local $/; <$in> };
        close($in);

        if ($content =~ s/const ALL_ITEMS = \[.*?\];/const ALL_ITEMS = $json_output;/s) {
            open(my $out_f, ">:raw", $target_file) or die $!;
            print $out_f $content;
            close($out_f);
            print "  -> $target_file aggiornato con successo!\n";
        } else {
            print "  -> ATTENZIONE: const ALL_ITEMS non trovato in $target_file\n";
        }
    }
}

# Ricarica automatica del server locale se attivo
`touch index.html`;
print "\nCOMPLETATO CON SUCCESSO! Il catalogo del sito e sincronizzato con il CSV.\n";
