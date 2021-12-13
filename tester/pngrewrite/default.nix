with import <nixpkgs>{};
stdenv.mkDerivation rec {
    pname = "pngrewrite";
    version = "1.4.0";

    buildInputs = [
        zlib
        libpng
    ];
    
    src = fetchzip {
        url = "https://entropymine.com/jason/pngrewrite/pngrewrite-${version}.zip";
        sha256 = "1rnrcrwx9w4bkpkcp1iapkxlxa0a6lpb13bzvfx09zkcdxd77qkv";
        stripRoot = false;
    };

    installPhase = ''
      install -m755 -D pngrewrite $out/bin/pngrewrite
    '';
}
