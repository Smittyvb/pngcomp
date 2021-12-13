const cmd = require("./cmd.js");

module.exports = [
    {
        name: "zopflipng",
        uri: "https://github.com/google/zopfli",
        run: cmd("zopflipng -m [input] [output]"),
    },
    {
        name: "pngout",
        uri: "http://advsys.net/ken/utils.htm",
        run: cmd("pngout -force [input] [output]")
    },
    {
        name: "FFmpeg",
        // doesn't detect invalid CRCs by default
        run: cmd("ffmpeg -err_detect crccheck -i [input] -compression_level 100 [output]"),
        uri: "https://ffmpeg.org/",
    },
    {
        name: "pngcrush",
        run: cmd("pngcrush -l 9 -reduce [input] [output]"),
        uri: "https://pmt.sourceforge.io/pngcrush/",
    },
    {
        name: "imagemagick",
        // default quality seems to be best
        run: cmd("convert -define png:compression-level=9 [input] [output]"),
        uri: "https://imagemagick.org/index.php",
    },
    {
        name: "optipng",
        // default quality seems to be best
        run: cmd("optipng -force -o7 [input] -out [output]"),
        uri: "http://optipng.sourceforge.net/",
    },
    {
        name: "oxipng",
        run: cmd("oxipng --force -o max [input] --out [output]"),
        uri: "https://github.com/shssoichiro/oxipng",
    },
    {
        name: "ImageWorsener",
        run: cmd("imagew [input] [output]"),
        uri: "https://entropymine.com/imageworsener/",
    },
    {
        name: "AdvanceCOMP",
        uri: "https://www.advancemame.it/comp-readme",
        // options: even if bigger, recompress, insane shrinking, 20 iterations
        run: cmd("cp [input] [output] && advpng -fz4 [output]")
    },
    {
        name: "pngrewrite",
        uri: "https://entropymine.com/jason/pngrewrite/",
        run: cmd("pngrewrite [input] [output]")
    },
];
