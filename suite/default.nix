with import <nixpkgs>{};
stdenv.mkDerivation rec {
    pname = "pngcomp-suite";
    version = "0.0.0";

    src = ./.;

    buildInputs = [
      wget
      cacert
    ];

    buildPhase = ''
      cd commons
      wget --user-agent="pngcomp/0.1 (pngcomp@smitop.com)" --content-disposition -i ../commons.urls
      cd ..
      find . -type f ! -name "*.png" -exec rm {} \;
    '';

    installPhase = ''
      cp -r . $out
    '';
}
