import * as fs from "node:fs";
import * as childProcess from "node:child_process";

const packageJson = JSON.parse(fs.readFileSync("./package.json", { encoding: "utf8" }));

const builtInfo = {
    copyrightYear: new Date().getFullYear(),
    version: packageJson.version,
    gitBranch: childProcess.execSync("git symbolic-ref --short HEAD").toString().trim(),
    gitHash: childProcess.execSync("git rev-parse HEAD").toString().trim(),
};

fs.writeFileSync("./app/version.json", JSON.stringify(builtInfo, null, 4));
