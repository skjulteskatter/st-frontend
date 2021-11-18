import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";

async function main() {
    const languages = readdirSync("./translations/data/");

    if (!existsSync("./translations/out")) {
        mkdirSync("./translations/out");
    }

    for (const language of languages) {
        const path = "./translations/data/" + language;

        try {
            const files = readdirSync(path);

            for (const fileName of files) {
                const content = readFileSync(path + "/" + fileName, {encoding: "utf-8"});
                
                const entries: {
                    [key: string]: string;
                } = {};
        
                for (const line of content.split("\n")) {
                    const data = line.split(";");
    
    
                    if (data.length !== 3){
                        continue;
                    }
        
                    try {
                        const value = JSON.parse(data[1]);
                        if (value) {
                            entries[JSON.parse(data[0])] = value;
                        }
                    }
                    catch {
                        //
                    }
                }
    
                if (Object.values(entries).length) {
                    writeFileSync("./translations/out/" + language.split("-")[0] + ".json", JSON.stringify(entries));
                }
            }
        }
        catch {
            // ignore errors;
        }
    }
}

main();

function getAllFiles(dirPath: string, arrayOfFiles: string[] | null) {
    const files = readdirSync(dirPath);
  
    arrayOfFiles = arrayOfFiles || [];
  
    files.forEach(function(file) {
        if (statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(join(__dirname + "/../../", dirPath, "/", file));
        }
    });
  
    return arrayOfFiles;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAllKeys() {
    const filepaths = getAllFiles("./src", null);

    const keys: string[] = [];

    for (const filepath of filepaths) {
        if ((filepath.endsWith(".ts") && !filepath.endsWith(".d.ts")) || filepath.endsWith(".vue")) {
            const content = readFileSync(filepath, {encoding: "utf-8"});

            const result = content.match(/(?<=\$t\(('|"))\w*(?=("|')\))/gm);

            if (result) {
                for (const key of result) {
                    if (!keys.includes(key)) {
                        keys.push(key);
                    }
                }
            }
        }
    }
}

// getAllKeys();
