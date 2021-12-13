with import <nixpkgs>{};
stdenv.mkDerivation rec {
    pname = "pngcomp-suite-raw";
    version = "0.0.0";

    src = import ../../suite;

    nativeBuildInputs = [
        imagemagick
    ];

    buildPhase = ''
      rm pngsuite/x*.png # invalid images
      magick mogrify -format ppm **/*.png *.png
      find . -type f ! -name "*.ppm" -exec rm {} \;
    '';

    installPhase = ''
      cp -r . $out
    '';
}
