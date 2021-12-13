with import <nixpkgs>{};
stdenv.mkDerivation rec {
    pname = "pngcomp-data";
    version = "0.0.0";

    buildInputs = [
        nodejs
        imagemagick

        ffmpeg
        pngcrush
        imagemagick
        optipng
        oxipng
        imageworsener
        advancecomp
        pngout
        zopfli
        (import ./pngrewrite)
    ];
    buildPhase = ''
      node run.js ${import ../suite} ${import ./suiteraw} > data.txt
    '';

    installPhase = ''
      cp data.txt $out
    '';

    src = ./.;
}
