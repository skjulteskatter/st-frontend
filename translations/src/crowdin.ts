import { SourceFiles, Translations } from "@crowdin/crowdin-api-client";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { get } from "https";
import * as unzipper from "unzipper";
import { token } from "./config";

const projectId = 482839;

const options = {
    token,
};

const translations = new Translations(options);

const sourceFiles = new SourceFiles(options);

const saveFile = async (url: string, path: string) => {
    await new Promise(resolve => {
        if (path.includes("/")) {
            const dir =  path.split("/").slice(0, -1).join("/");
            if (!existsSync("./translations/" + dir)) {
                mkdirSync("./translations/" + dir, {recursive: true});
            }
        }
    
        const file = createWriteStream("./translations/" + path);
        get(url, function(response) {
            response.pipe(file);
    
            response.on("end", () => {
                resolve(true);
            });
        });
    });
};
const extractFile = async (url: string, path: string) => {
    await new Promise(resolve => {
        if (path.includes("/")) {
            const dir =  path.split("/").slice(0, -1).join("/");
            if (!existsSync("./translations/" + dir)) {
                mkdirSync("./translations/" + dir, {recursive: true});
            }
        }
    
        const extractTo = unzipper.Extract({path: "./translations/" + path});
        get(url, function(response) {
            response.pipe(extractTo);
            response.on("end", () => {
                resolve(true);
            });
        });
    });
};

export const getTranslations = async () => {
    const result = await translations.buildProject(projectId);

    let downloaded = await translations.downloadTranslations(projectId, result.data.id);

    while(!downloaded.data.url) {
        await new Promise(r => setTimeout(r, 3000));

        downloaded = await translations.downloadTranslations(projectId, result.data.id);
    }

    await extractFile(downloaded.data.url, "data");

    const files = await sourceFiles.listProjectFiles(projectId);

    for (const f of files.data) {
        const content = await sourceFiles.downloadFile(projectId, f.data.id);

        await saveFile(content.data.url, "data/en/" + f.data.name);
    }
};
