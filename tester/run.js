const fs = require("fs");
const engines = require("./engines.js");
const { execSync } = require("child_process");

const TMP = process.env.TMP || "/tmp";
const IN_PATH = `${TMP}/pngcomp_in.png`;
const OUT_PATH = `${TMP}/pngcomp_out.png`;
const OUT_RAW_PATH = `${TMP}/pngcomp_out.ppm`;
const COMP_RAW_PATH = `${TMP}/pngcomp_out_comp.ppm`;

const SUITE_PATH = process.argv[2] || __dirname + "../suite";
const SUITE_RAW_PATH = process.argv[3];

const suiteFilenames = execSync("find -type f", {
        cwd: SUITE_PATH
    })
    .toString("utf-8")
    .split("\n")
    .filter(file => file.endsWith(".png") && !file.includes("Confocal_measurement_of_1-euro-star_3d_and_euro"));

function prepImg(name) {
    console.error("copying", name)
    fs.copyFileSync(SUITE_PATH + "/" + name, IN_PATH);
}

let data = {
    engines: {},
};
engines.forEach((engine, engineIdx) => {
    let engineRuns = {};
    suiteFilenames.forEach(filename => {
        try {
            fs.unlinkSync(IN_PATH);
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw e;
            }
        }
        try {
            fs.unlinkSync(OUT_PATH);
        } catch (e) {
            if (e.code !== "ENOENT") {
                throw e;
            }
        }
        prepImg(filename);
        const inSize = fs.statSync(IN_PATH).size;
        let outSize;
        try {
            engine.run(IN_PATH, OUT_PATH);
            outSize = fs.statSync(OUT_PATH).size;
        } catch (e) {
            outSize = null;
        }
        // Treat too short outputs as errors
        // 67 bytes is shortest valid PNG: https://garethrees.org/2007/11/14/pngcrush/
        if (outSize < 67) outSize = null;
        let notSame = false;
        if (outSize !== null && SUITE_RAW_PATH) {
            let copyFail = false;
            try {
                fs.copyFileSync(`${SUITE_RAW_PATH}/${filename.slice(0, -3)}ppm`, COMP_RAW_PATH);
            } catch (e) {
                copyFail = true;
            }
            if (!copyFail) {
                const cmpOut = execSync(
                    `magick mogrify -format ppm ${OUT_PATH};cmp -s ${OUT_RAW_PATH} ${COMP_RAW_PATH}||echo "fail"`
                );
                fs.unlinkSync(COMP_RAW_PATH);
                if (cmpOut.includes("fail")) {
                    notSame = true;
                }
            }
        }
        engineRuns[filename] = {
            inSize,
            outSize,
            notSame,
        };
        console.error(`${engine.name} on ${filename}: ${inSize} -> ${outSize}${notSame ? " (DIFFERS)" : ""}`);
    });
    data.engines["engine" + engineIdx] = {
        name: engine.name,
        uri: engine.uri,
        runs: engineRuns,
    };
});
console.log(JSON.stringify(data));
