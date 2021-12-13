with import <nixpkgs>{};
stdenv.mkDerivation rec {
    pname = "pngcomp-site";
    version = "0.0.0";

    buildInputs = [
        nodejs
        ffmpeg
        pngcrush
        imagemagick
        optipng
        oxipng
        imageworsener
        advancecomp
    ];

    buildPhase = ''
      mkdir public
      PNGCOMP_PUBLIC=public node build.js ${import ../tester}
    '';

    installPhase = ''
      cp -r public $out
    '';

    src = ./.;
}
