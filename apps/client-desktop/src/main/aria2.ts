import { spawn } from "child_process";
import { app, ipcMain } from "electron";
import detect from "detect-port";
import path from "path";
import fs from "fs";

import aria2Win from "../../resources/vendors/aria2/aria2c.exe?asset&asarUnpack";
// eslint-disable-next-line import/extensions
import aria2MacArm from "../../resources/vendors/aria2/aria2c-mac-arm64?asset&asarUnpack";
// eslint-disable-next-line import/extensions
import aria2MacIntel from "../../resources/vendors/aria2/aria2c-mac-x86?asset&asarUnpack";

async function findPort() {
    const portStart = 49152;
    const portEnd = 65535;
    let port = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        port = Math.floor(Math.random() * (portEnd - portStart)) + portStart;
        const result = await detect(port);
        if (result === port) {
            return port;
        }
    }
}

export default async function initAria2() {
    let ariaPath = "aria2c";
    const port = await findPort();
    switch (true) {
        case process.platform === "win32": {
            ariaPath = aria2Win;
            break;
        }
        case process.platform === "darwin" && process.arch === "arm64": {
            ariaPath = aria2MacArm;
            break;
        }
        case process.platform === "darwin": {
            ariaPath = aria2MacIntel;
            break;
        }
        default: {
            break;
        }
    }

    const sessionPath = path.join(app.getPath("userData"), "aria2-session.txt");
    if (!fs.existsSync(sessionPath)) {
        fs.writeFileSync(sessionPath, "");
    }

    const args = [
        "--enable-rpc=true",
        `--rpc-listen-port=${port}`,
        "--rpc-allow-origin-all=true",
        "--rpc-listen-all=false",
        // `--save-session=${sessionPath}`,
        // `--input-file=${sessionPath}`,
        // "--save-session-interval=10",
    ];
    if (!app.isPackaged) {
        console.log(`Launching aria2: ${ariaPath} ${args.join(" ")}`);
    }
    const ariaProcess = spawn(ariaPath, args);
    if (!app.isPackaged) {
        ariaProcess.stdout.pipe(process.stdout);
        ariaProcess.stderr.pipe(process.stderr);
    }

    process.on("SIGTERM", () => {
        ariaProcess.kill("SIGTERM");
    });

    ipcMain.on("aria2.getPort", (event) => {
        event.returnValue = port;
    });

    return { ariaProcess, port };
}
