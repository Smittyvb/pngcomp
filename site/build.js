const fs = require("fs");

const OUT = process.env.PNGCOMP_PUBLIC ?? process.env.PNGCOMP_PUBLIC + "/public";
const DATA_PATH = process.argv[2];
const DATA = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

const isPngsuite = name => name.startsWith("./pngsuite") && name !== "./pngsuite/PngSuite.png";

const images = Object.keys(DATA.engines.engine0.runs).sort((a, b) => {
    // sort pngsuite images below everything else
    if (!isPngsuite(a) && isPngsuite(b)) return -1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
});
const engines = Object.keys(DATA.engines).sort((a, b) => {
    const aSum = Object.values(DATA.engines[a].runs).reduce((sum, run) => sum + getFrac(run.inSize, run.outSize), 0);
    const bSum = Object.values(DATA.engines[b].runs).reduce((sum, run) => sum + getFrac(run.inSize, run.outSize), 0);
    if (aSum < bSum) return 1;
    if (aSum > bSum) return -1;
    return 0;
});

function trunc(text, len) {
    if (text.length <= len) return text;
    return text.slice(0, len - 1) + "…";
}

function getStyle(inSize, outSize) {
    if (outSize === null) return "background-color:gray;color:white";
    if (inSize === outSize) return "background-color:gray;color:white";
    let pct = (outSize / inSize) - 1;
    const bg = pct < 0 ? `rgb(${(0.5+pct*0.7) * 100}%, ${(0.5-pct*0.7) * 100}%, ${(0.5+pct*0.7) * 100}%)` :
        `rgb(${(0.5+pct*0.7) * 100}%, ${(0.5-pct*0.7) * 100}%, ${(0.5-pct*0.7) * 100}%)`;
    const fg = "white";
    return `/*${pct}*/background-color:${bg};color:${fg}`;
}
function getFrac(inSize, outSize) {
    let num = (((outSize / inSize) - 1) * 100);
    let str = num.toFixed(2);
    if (num > 0) str = "+" + str;
    return str;
}

console.log("building with data path", DATA_PATH);
fs.writeFileSync(
    OUT + "/index.html",
    fs.readFileSync(__dirname + "/tmpl/index.html", "utf-8")
        .replace("%STYLE%", fs.readFileSync(__dirname + "/tmpl/style.css", "utf-8"))
        .replace("%COMPRESSORS%", engines.map(key => `<th scope="col" id="${key}"><a href="${DATA.engines[key].uri}">${DATA.engines[key].name}</a></th>`).join(""))
        .replace("%IMAGES%",
            images
                // if oxipng rejects it, hide it
                .filter(img => DATA.engines.engine4.runs[img].outSize !== null)
                .map(img => {
                    const notSame = DATA.engines.engine0.runs[img].notSame;
                    const inSize = DATA.engines.engine0.runs[img].inSize;
                    const bestOut = Math.min.apply(null, engines.map(engine => DATA.engines[engine].runs[img].outSize).filter(x => x));
                    const NAME_LEN = 20;
                    let shortName;
                    if (img.startsWith("./commons/")) {
                        shortName = `<a href="https://commons.wikimedia.org/wiki/File:${img.slice(10)}" target="_blank">c/${
                            trunc(img.slice(10, -4).replace(/_/g, " "), NAME_LEN - 2)
                        }</a>`;
                    } else {
                        // strip ./ and .png
                        shortName = trunc(img.slice(2, -4), NAME_LEN);
                    }
                    return `<tr><th scope="row" class="filename" title="${img}">${shortName}</th>` +
                        engines.map(engine => {
                            const outSize = DATA.engines[engine].runs[img].outSize;
                            return `<td style="${getStyle(inSize, outSize)}" class="${notSame ? "differs" : "same"} ${outSize === bestOut ? "best-engine" : ""}">${outSize ? getFrac(inSize, outSize) : "(failure)"}%</td>`
                        }).join("") +
                        `<td style="${getStyle(inSize, bestOut)}">${getFrac(inSize, bestOut)}%</td></tr>`;
                })
                .join("")
        )
);
