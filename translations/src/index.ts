import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { join } from "path";
import { getTranslations } from "./crowdin";

function CSVToArray(strData: string, strDelimiter: string) {
    strDelimiter = (strDelimiter || ",");
    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi",
        );
    const arrData = [[]];
    let arrMatches = null;
    while ((arrMatches = objPattern.exec( strData ))){
        const strMatchedDelimiter = arrMatches[ 1 ];
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){
            arrData.push( [] );

        }

        let strMatchedValue;
        if (arrMatches[ 2 ]){
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\"",
                );

        } else {
            strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

function main() {
    const languages = readdirSync("./translations/data/");

    if (!existsSync("./translations/out")) {
        mkdirSync("./translations/out");
    }

    for (const language of languages) {
        const path = "./translations/data/" + language;

        try {
            const files = readdirSync(path);
                
            const entries: {
                [key: string]: string;
            } = {};

            for (const fileName of files) {
                const content = readFileSync(path + "/" + fileName, {encoding: "utf-8"});

                let data = CSVToArray(content, ";");

                // In case it's already fixed (old solution only had 3 entries)
                if (data[0].length !== 3) {
                    data = CSVToArray(content, ",");
                }
        
                for (const line of data) {
                    try {
                        const value = line[1];
                        if (value) {
                            entries[line[0] as string] = value;
                        }
                    }
                    catch {
                        //
                    }
                }
            }
    
            if (Object.values(entries).length) {
                writeFileSync("./translations/out/" + language.split("-")[0] + ".json", JSON.stringify(entries, null, 4));
            }
        }
        catch {
            // ignore errors;
        }
    }
}

// main();

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toCsv() {
    if (!existsSync("./translations/out")) {
        throw new Error("Need to make translations first");
    }

    if (!existsSync("./translations/out-csv")) {
        mkdirSync("./translations/out-csv");
    }

    const files = readdirSync("./translations/out");

    for (const file of files) {
        const content = readFileSync("./translations/out/" + file, {encoding: "utf-8"});

        const entries = JSON.parse(content) as {
            [key: string]: string;
        };

        let csv = "";

        for (const [key, value] of Object.entries(entries)) {
            csv += `${JSON.stringify(key)},${JSON.stringify(value)},"","",""\n`;
        }

        if (csv.length) {
            writeFileSync("./translations/out-csv/" + file.split(".")[0] + ".csv", csv);
        }
    }
}

// toCsv();

getTranslations().then(() => main());
