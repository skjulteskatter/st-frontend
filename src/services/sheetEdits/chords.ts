import type { Harmony, HarmonyDegree, HarmonyRoot, Step } from "./types";

type ChordType = {
    kind: string;
    degrees?: HarmonyDegree[];
};

const add = (value: number, alter = 0): HarmonyDegree => ({ value, alter, type: "add" });
const alter = (value: number, by: number): HarmonyDegree => ({ value, alter: by, type: "alter" });

/** Chord suffixes the editor understands, first spelling per type is used when formatting. */
const suffixes: [string[], ChordType][] = [
    [["", "maj", "M"], { kind: "major" }],
    [["m", "min", "-"], { kind: "minor" }],
    [["dim", "°", "o"], { kind: "diminished" }],
    [["aug", "+"], { kind: "augmented" }],
    [["5"], { kind: "power" }],
    [["6"], { kind: "major-sixth" }],
    [["m6", "min6", "-6"], { kind: "minor-sixth" }],
    [["6/9", "69"], { kind: "major-sixth", degrees: [add(9)] }],
    [["7"], { kind: "dominant" }],
    [["maj7", "M7", "ma7", "Δ", "Δ7"], { kind: "major-seventh" }],
    [["m7", "min7", "-7"], { kind: "minor-seventh" }],
    [["dim7", "°7", "o7"], { kind: "diminished-seventh" }],
    [["m7b5", "ø", "ø7", "-7b5"], { kind: "half-diminished" }],
    [["aug7", "+7", "7#5", "7+5"], { kind: "augmented-seventh" }],
    [["m(maj7)", "mmaj7", "mMaj7", "mM7", "-maj7"], { kind: "major-minor" }],
    [["9"], { kind: "dominant-ninth" }],
    [["maj9", "M9"], { kind: "major-ninth" }],
    [["m9", "min9", "-9"], { kind: "minor-ninth" }],
    [["11"], { kind: "dominant-11th" }],
    [["maj11", "M11"], { kind: "major-11th" }],
    [["m11", "min11", "-11"], { kind: "minor-11th" }],
    [["13"], { kind: "dominant-13th" }],
    [["maj13", "M13"], { kind: "major-13th" }],
    [["m13", "min13", "-13"], { kind: "minor-13th" }],
    [["sus2"], { kind: "suspended-second" }],
    [["sus4", "sus"], { kind: "suspended-fourth" }],
    [["7sus4", "7sus"], { kind: "suspended-fourth", degrees: [add(7, -1)] }],
    [["add9", "add2"], { kind: "major", degrees: [add(9)] }],
    [["madd9", "m(add9)"], { kind: "minor", degrees: [add(9)] }],
    [["7b5"], { kind: "dominant", degrees: [alter(5, -1)] }],
    [["7b9"], { kind: "dominant", degrees: [add(9, -1)] }],
    [["7#9"], { kind: "dominant", degrees: [add(9, 1)] }],
    [["7#11"], { kind: "dominant", degrees: [add(11, 1)] }],
    [["maj7#11"], { kind: "major-seventh", degrees: [add(11, 1)] }],
];

const suffixLookup = new Map<string, ChordType>();
for (const [spellings, type] of suffixes) {
    for (const s of spellings) suffixLookup.set(s, type);
}

const notePattern = /^([A-G])([#♯b♭]?)/;

function parseNote(text: string): { root: HarmonyRoot; rest: string } | null {
    const match = notePattern.exec(text);
    if (!match) return null;
    const accidental = match[2];
    return {
        root: {
            step: match[1] as Step,
            alter: accidental === "#" || accidental === "♯" ? 1 : accidental === "b" || accidental === "♭" ? -1 : 0,
        },
        rest: text.slice(match[0].length),
    };
}

export function formatNote(note: HarmonyRoot): string {
    return note.step + (note.alter > 0 ? "#".repeat(note.alter) : "b".repeat(-note.alter));
}

/** Parses a chord symbol such as "F#m7/C#". Returns null if it isn't recognised. */
export function parseChord(input: string): Harmony | null {
    const text = input.trim();
    const head = parseNote(text);
    if (!head) return null;

    let suffix = head.rest;
    let bass: HarmonyRoot | undefined;

    // A slash is a bass note only when a note follows it ("C6/9" is not a slash chord)
    const slash = suffix.lastIndexOf("/");
    if (slash >= 0) {
        const bassNote = parseNote(suffix.slice(slash + 1));
        if (bassNote && bassNote.rest === "") {
            bass = bassNote.root;
            suffix = suffix.slice(0, slash);
        }
    }

    const type = suffixLookup.get(suffix);
    if (!type) return null;

    return {
        text,
        root: head.root,
        kind: type.kind,
        kindText: suffix,
        ...(bass ? { bass } : {}),
        ...(type.degrees ? { degrees: type.degrees } : {}),
    };
}

function sameDegrees(a: HarmonyDegree[] = [], b: HarmonyDegree[] = []) {
    return a.length === b.length && a.every((d, i) => d.value === b[i].value && d.alter === b[i].alter && d.type === b[i].type);
}

/** Formats a chord read from a file, preferring the suffix the file itself prints. */
export function formatChord(harmony: Omit<Harmony, "text">): string {
    let suffix = harmony.kindText;
    if (!suffix && harmony.kind !== "major") {
        suffix = suffixes.find(([, t]) => t.kind === harmony.kind && sameDegrees(t.degrees, harmony.degrees))?.[0][0] ?? harmony.kind;
    }
    return formatNote(harmony.root) + suffix + (harmony.bass ? "/" + formatNote(harmony.bass) : "");
}

const sameNote = (a?: HarmonyRoot, b?: HarmonyRoot) => a?.step === b?.step && (a?.alter ?? 0) === (b?.alter ?? 0);

/** The check used before applying an edit: same root, kind and bass. */
export function sameChord(a: Harmony | null, b: Harmony | null): boolean {
    if (!a || !b) return a === b;
    return sameNote(a.root, b.root) && a.kind === b.kind && sameNote(a.bass, b.bass);
}
