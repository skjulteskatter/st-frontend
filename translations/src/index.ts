import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";

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
