const { execSync } = require("child_process");

module.exports = function cmd(c) {
    return function cmdRun(inPath, outPath) {
        const command = c
            .replace(/\[input\]/g, inPath)
            .replace(/\[output\]/g, outPath);
        execSync(command);
    }
};
