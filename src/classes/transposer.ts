type Keys = ("Ab" | "A" | "A#" | "Bb" | "B" | "C" | "C#" | "Db" | "D" | "D#" | "Eb" | "E" | "F" | "F#" | "Gb" | "G" | "G#")

const positiveKeyToInt: {
    [key: string]: number;
} = {
    "C": 0,
    "C#": 1,
    "Db": 1,
    "D": 2,
    "D#": 3,
    "Eb": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "Gb": 6,
    "G": 7,
    "G#": 8,
    "Ab": 8,
    "A": 9,
    "A#": 10,
    "Bb": 10,
    "B": 11,
};

const negativeKeyToInt: {
    [key: string]: number;
} = {
    "C": -12,
    "Db": -11,
    "C#": -11,
    "D": -10,
    "Eb": -9,
    "D#": -9,
    "E": -8,
    "F": -7,
    "Gb": -6,
    "F#": -6,
    "G": -5,
    "Ab": -4,
    "G#": -4,
    "A": -3,
    "Bb": -2,
    "A#": -2,
    "B": -1,
};

const keyToInt: {
    [key: string]: number;
} = {
    "C": 0,
    "Db": 1,
    "D": 2,
    "Eb": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "G": 7,
    "Ab": 8,
    "A": 9,
    "Bb": 10,
    "B": 11,
}

// const trueTranspositions: {
//     [key: string]: number;
// } = {
//     "C": 0,
//     "C#": 1,
//     "D": 2,
//     "Eb": 3,
//     "E": 4,
//     "F": 5,
//     "F#": 6,
//     "G": 7,
//     "Ab": 8,
//     "A": 9,
//     "Bb": 10,
//     "B": 11,
// };

const smTs: {
    [key: string]: number;
} = {
    "C": 0,
    "Db": -1,
    "D": -2,
    "Eb": 9,
    "E": 8,
    "F": 7,
    "F#": 6,
    "G": 5,
    "Ab": 4,
    "A": 3,
    "Bb": 2,
    "B": 1,
};

const sort = ["Ab", "A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"];

const commonTranspositions: {
    [key: string]: number;
} = {
    "C": 0,
    "Db": 11,
    "C#": 11,
    "D": 10,
    "Eb": 9,
    "D#": 9,
    "E": 8,
    "F": 7,
    "F#": 6,
    "Gb": 6,
    "G": 5,
    "Ab": 4,
    "G#": 4,
    "A": 3,
    "Bb": 2,
    "A#": 2,
    "B": 1,
};

type Transpositions = {
    [key: string]: number;
}

class Transposer {
    public getTranspositions(originalKey: string, sheetMusic = false) {
        if (!originalKey) {
            return {};
        }

        const ts: Transpositions = {};

        if (sheetMusic) {
            const relative = this.getRelativeTransposition(originalKey);
            for (const e of Object.entries(commonTranspositions)) {
                const r = e[1] - relative;
                const rel = r < 0 ? r + 12 : r;
                if (!Object.values(ts).includes(rel)) {
                    ts[this.getTransposedString(originalKey, rel, sheetMusic) ?? "C"] = rel;
                }
            }
        } else {
            for (let i = -12; i < 13; i++) {
                if ((i == 12 || i == -12) && !originalKey.includes("b")) {
                    continue;
                }
    
                const transposition = this.getTransposedString(originalKey, i) ?? originalKey;
    
                ts[transposition] = i;
            }
        }

        return ts;
    }
    
    public getRelativeTransposition(relativeKey: string, sheetMusic = false) {
        return sheetMusic ? smTs[relativeKey] : commonTranspositions[relativeKey];
    }

    public getTransposition(originalKey: string, relativeKey: string) {
        const diff = commonTranspositions[originalKey] - commonTranspositions[relativeKey];
        return diff > 0 ? diff : diff + 12;
    }

    public getRelativeTranspositions(originalKey: string, relativeKey: string, transpositions: {
        [key: string]: number;
    }): {
        key: string;
        value: number;
        view: string;
        original: string;
    }[] {
        const result: {
            key: string;
            value: number;
            view: string;
            original: string;
        }[] = [];
        for (const e of Object.entries(transpositions)) {
            let t = this.getRelativeTransposition(originalKey) + this.getRelativeTransposition(relativeKey) - e[1];

            while(t % 12 > 0) {
                t = t - 12;
            }
            
            if (t < 0)
                t = t + 12;

            const ss = Object.entries(commonTranspositions).find(en => en[1] == t)?.[0] ?? "C";

            result.push({
                key: e[0],
                value: e[1],
                view: "C" != relativeKey ? `${e[0]} (${ss})` : e[0],
                original: ss,
            });
        }

        return result.sort((a, b) => sort.indexOf(a.key) - sort.indexOf(b.key));
    }

    public getTransposedString(originalKey: string, transposition: number, sheetmusic = false) {
        if (transposition == 0) {
            return originalKey;
        }

        if (sheetmusic) {
            const t = keyToInt[originalKey] + transposition;

            if (Object.values(keyToInt).includes(t)) {
                return Object.entries(keyToInt).find(e => e[1] == t)?.[0];
            } else {
                return Object.entries(keyToInt).find(e => e[1] == t - 12)?.[0];
            }
        }

        if (transposition < 0) {
            const t = negativeKeyToInt[originalKey] + transposition;

            let value = t < -12 ? t + 12 : t;

            if (transposition == -12) {
                value = t + 12;
            }

            for (const k of Object.keys(negativeKeyToInt)) {
                if (negativeKeyToInt[k] == value) {
                    return k;
                }
            }
        } else {
            const t = positiveKeyToInt[originalKey] + transposition;

            let value = t > 11 ? t - 12 : t;

            if (transposition == 12) {
                value = t - 12;
            }

            for (const k of Object.keys(positiveKeyToInt)) {
                if (positiveKeyToInt[k] == value) {
                    return k;
                }
            }
        }

    }
}

export const transposer = new Transposer();
