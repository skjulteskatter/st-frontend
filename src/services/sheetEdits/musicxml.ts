import { formatChord, formatNote, sameChord } from "./chords";
import type { ChordEdit, Fraction, Harmony, HarmonyRoot, Pitch, PitchEdit, SheetEdit, Step } from "./types";

// Fractions are whole notes, always reduced so they can be compared and stored as-is

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) || 1 : gcd(b, a % b));

export function fraction(numerator: number, denominator: number): Fraction {
    const d = gcd(numerator, denominator);
    return [numerator / d, denominator / d];
}

const addFractions = (a: Fraction, b: Fraction) => fraction(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);

export const sameFraction = (a: Fraction, b: Fraction) => a[0] * b[1] === b[0] * a[1];

export const samePitch = (a: Pitch | null, b: Pitch | null) =>
    a?.step === b?.step && a?.alter === b?.alter && a?.octave === b?.octave;

export function formatPitch(pitch: Pitch): string {
    return formatNote(pitch) + pitch.octave;
}

/** Fetches a MusicXML file as XML text, unpacking compressed (.mxl) files, also when stored as base64. */
export async function fetchMusicXml(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Couldn't fetch sheet music (${response.status})`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const unzip = async (zip: Uint8Array<ArrayBuffer>) => (await import("opensheetmusicdisplay")).MXLHelper.MXLtoXMLstring(new Blob([zip]));

    if (bytes[0] === 0x50 && bytes[1] === 0x4b) return await unzip(bytes);

    const text = new TextDecoder().decode(bytes);
    if (!text.includes("<")) return await unzip(Uint8Array.from(atob(text.trim()), (c) => c.charCodeAt(0)));
    return text;
}

export async function hashMusicXml(xml: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(xml));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export type NoteEntry = {
    part: string;
    measure: number;
    voice: string;
    offset: Fraction;
    end: Fraction;
    element: Element;
    /** Pitch before any edits; null for rests and unpitched notes. */
    original: Pitch | null;
    isChordNote: boolean;
    tieStart: boolean;
    tieStop: boolean;
    /** Key signature (`<fifths>`) in effect for the note. */
    fifths: number;
};

export type HarmonyEntry = {
    part: string;
    measure: number;
    offset: Fraction;
    element: Element;
    /** Chord before any edits; null for chords added by an edit. */
    original: Harmony | null;
};

export type ScoreIndex = {
    doc: XMLDocument;
    notes: NoteEntry[];
    harmonies: HarmonyEntry[];
};

const child = (element: Element, name: string) => Array.from(element.children).find((c) => c.tagName === name);
const childText = (element: Element, name: string) => child(element, name)?.textContent?.trim();
const childNumber = (element: Element, name: string) => {
    const text = childText(element, name);
    return text === undefined ? undefined : Number(text);
};

export function readPitch(note: Element): Pitch | null {
    const pitch = child(note, "pitch");
    if (!pitch) return null;
    return {
        step: childText(pitch, "step") as Step,
        alter: childNumber(pitch, "alter") ?? 0,
        octave: childNumber(pitch, "octave") ?? 4,
    };
}

function readNote(element: Element, prefix: string): HarmonyRoot | undefined {
    const step = childText(element, `${prefix}-step`);
    if (!step) return undefined;
    return { step: step as Step, alter: childNumber(element, `${prefix}-alter`) ?? 0 };
}

/** Reads a chord symbol. Returns null for harmonies without a root (roman numerals, functions). */
export function readHarmony(harmony: Element): Harmony | null {
    const rootElement = child(harmony, "root");
    const root = rootElement && readNote(rootElement, "root");
    if (!root) return null;

    const kindElement = child(harmony, "kind");
    const bassElement = child(harmony, "bass");
    const degrees = Array.from(harmony.children)
        .filter((c) => c.tagName === "degree")
        .map((d) => ({
            value: childNumber(d, "degree-value") ?? 0,
            alter: childNumber(d, "degree-alter") ?? 0,
            type: (childText(d, "degree-type") ?? "add") as "add" | "alter" | "subtract",
        }));

    const chord: Omit<Harmony, "text"> = {
        root,
        kind: kindElement?.textContent?.trim() || "major",
        kindText: kindElement?.getAttribute("text") ?? "",
        ...(bassElement && readNote(bassElement, "bass") ? { bass: readNote(bassElement, "bass") } : {}),
        ...(degrees.length ? { degrees } : {}),
    };
    return { ...chord, text: formatChord(chord) };
}

export function parseMusicXml(xml: string): XMLDocument {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    if (doc.querySelector("parsererror")) throw new Error("File is not valid MusicXML");
    if (doc.documentElement.tagName !== "score-partwise") throw new Error("Only partwise MusicXML can be edited");
    return doc;
}

/** Finds every note and chord symbol in the score with the address edits use for it. */
export function indexScore(doc: XMLDocument): ScoreIndex {
    const notes: NoteEntry[] = [];
    const harmonies: HarmonyEntry[] = [];

    for (const part of Array.from(doc.documentElement.children).filter((c) => c.tagName === "part")) {
        const partId = part.getAttribute("id") ?? "";
        let divisions = 1;
        let fifths = 0;

        Array.from(part.children)
            .filter((c) => c.tagName === "measure")
            .forEach((measure, measureIndex) => {
                let position: Fraction = [0, 1];
                let lastStart: Fraction = [0, 1];
                const duration = (element: Element): Fraction => fraction(Math.round(childNumber(element, "duration") ?? 0), 4 * divisions);

                for (const element of Array.from(measure.children)) {
                    switch (element.tagName) {
                        case "attributes": {
                            divisions = childNumber(element, "divisions") ?? divisions;
                            const key = child(element, "key");
                            if (key) fifths = childNumber(key, "fifths") ?? fifths;
                            break;
                        }
                        case "backup":
                            position = addFractions(position, fraction(-duration(element)[0], duration(element)[1]));
                            break;
                        case "forward":
                            position = addFractions(position, duration(element));
                            break;
                        case "harmony": {
                            const offset = childNumber(element, "offset");
                            harmonies.push({
                                part: partId,
                                measure: measureIndex,
                                offset: offset ? addFractions(position, fraction(Math.round(offset), 4 * divisions)) : position,
                                element,
                                original: readHarmony(element),
                            });
                            break;
                        }
                        case "note": {
                            if (child(element, "grace")) break;
                            const isChordNote = !!child(element, "chord");
                            const start = isChordNote ? lastStart : position;
                            const end = addFractions(start, duration(element));
                            if (!isChordNote) {
                                lastStart = position;
                                position = end;
                            }
                            const ties = Array.from(element.children).filter((c) => c.tagName === "tie");
                            notes.push({
                                part: partId,
                                measure: measureIndex,
                                voice: childText(element, "voice") ?? "1",
                                offset: start,
                                end,
                                element,
                                original: readPitch(element),
                                isChordNote,
                                tieStart: ties.some((t) => t.getAttribute("type") === "start"),
                                tieStop: ties.some((t) => t.getAttribute("type") === "stop"),
                                fifths,
                            });
                            break;
                        }
                    }
                }
            });
    }

    return { doc, notes, harmonies };
}

function setChildText(parent: Element, name: string, value: string, before?: Element | null) {
    let element = child(parent, name);
    if (!element) {
        element = parent.ownerDocument.createElement(name);
        parent.insertBefore(element, before ?? null);
    }
    element.textContent = value;
}

function writePitch(note: Element, to: Pitch) {
    const pitch = child(note, "pitch");
    if (!pitch) return;
    setChildText(pitch, "step", to.step, pitch.firstElementChild);
    if (to.alter === 0) {
        child(pitch, "alter")?.remove();
    } else {
        setChildText(pitch, "alter", to.alter.toString(), child(pitch, "octave"));
    }
    setChildText(pitch, "octave", to.octave.toString());
    // Let the renderer work out accidentals for the new pitch
    child(note, "accidental")?.remove();
}

function element(doc: XMLDocument, name: string, text?: string, attributes: Record<string, string> = {}) {
    const e = doc.createElement(name);
    if (text !== undefined) e.textContent = text;
    Object.entries(attributes).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
}

function writeNote(doc: XMLDocument, name: string, prefix: string, note: HarmonyRoot) {
    const e = element(doc, name);
    e.append(element(doc, `${prefix}-step`, note.step));
    if (note.alter) e.append(element(doc, `${prefix}-alter`, note.alter.toString()));
    return e;
}

function writeHarmony(harmony: Element, to: Harmony) {
    const doc = harmony.ownerDocument as XMLDocument;
    const replaced = ["root", "numeral", "function", "kind", "inversion", "bass", "degree"];
    Array.from(harmony.children)
        .filter((c) => replaced.includes(c.tagName))
        .forEach((c) => c.remove());

    // These come first in <harmony>, in this order
    const content = [writeNote(doc, "root", "root", to.root), element(doc, "kind", to.kind, { text: to.kindText })];
    if (to.bass) content.push(writeNote(doc, "bass", "bass", to.bass));
    for (const d of to.degrees ?? []) {
        const degree = element(doc, "degree");
        degree.append(
            element(doc, "degree-value", d.value.toString()),
            element(doc, "degree-alter", d.alter.toString()),
            element(doc, "degree-type", d.type),
        );
        content.push(degree);
    }
    harmony.prepend(...content);
}

const findHarmony = (index: ScoreIndex, part: string, measure: number, offset: Fraction) =>
    index.harmonies.find((h) => h.part === part && h.measure === measure && sameFraction(h.offset, offset));

function applyChord(index: ScoreIndex, edit: ChordEdit): boolean {
    const existing = findHarmony(index, edit.part, edit.measure, edit.offset);
    const current = existing ? readHarmony(existing.element) : null;
    if (!sameChord(current, edit.from) || (existing && !current)) return false;

    if (existing && !edit.to) {
        existing.element.remove();
        index.harmonies.splice(index.harmonies.indexOf(existing), 1);
    } else if (existing && edit.to) {
        writeHarmony(existing.element, edit.to);
    } else if (edit.to) {
        // A chord symbol belongs to the note that follows it
        const note = index.notes.find(
            (n) => n.part === edit.part && n.measure === edit.measure && !n.isChordNote && sameFraction(n.offset, edit.offset),
        );
        if (!note) return false;
        const harmony = index.doc.createElement("harmony");
        writeHarmony(harmony, edit.to);
        note.element.before(harmony);
        index.harmonies.push({ part: edit.part, measure: edit.measure, offset: edit.offset, element: harmony, original: null });
    }
    return true;
}

function applyPitch(index: ScoreIndex, edit: PitchEdit): boolean {
    const note = index.notes.find(
        (n) =>
            n.part === edit.part &&
            n.measure === edit.measure &&
            n.voice === edit.voice &&
            sameFraction(n.offset, edit.offset) &&
            samePitch(readPitch(n.element), edit.from),
    );
    if (!note) return false;
    writePitch(note.element, edit.to);
    return true;
}

/** Applies edits to the indexed document in place. Returns the edits that no longer match the file. */
export function applyEdits(index: ScoreIndex, edits: SheetEdit[]): SheetEdit[] {
    return edits.filter((edit) => !(edit.type === "chord" ? applyChord(index, edit) : applyPitch(index, edit)));
}

export function serializeMusicXml(doc: XMLDocument): string {
    const xml = new XMLSerializer().serializeToString(doc);
    // The serializer leaves out the <?xml ?> declaration, but osmd.load(string) only parses strings starting with it
    return xml.startsWith("<?xml") ? xml : `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
}

/** The notes tied to this one, in order, so a move can take them along. */
export function tiedNotes(index: ScoreIndex, note: NoteEntry): NoteEntry[] {
    const result: NoteEntry[] = [];
    let current = note;
    while (current.tieStart) {
        const from = current;
        const next = index.notes.find(
            (n) =>
                n.part === from.part &&
                n.voice === from.voice &&
                n.tieStop &&
                samePitch(n.original, from.original) &&
                ((n.measure === from.measure && sameFraction(n.offset, from.end)) ||
                    (n.measure === from.measure + 1 && n.offset[0] === 0)),
        );
        if (!next || result.includes(next)) break;
        result.push(next);
        current = next;
    }
    return result;
}

// Moving notes

const steps: Step[] = ["C", "D", "E", "F", "G", "A", "B"];
const semitones: Record<Step, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const sharpOrder: Step[] = ["F", "C", "G", "D", "A", "E", "B"];

/** The alteration the key signature gives a step, e.g. F in G major is 1. */
function keyAlter(step: Step, fifths: number): number {
    if (fifths > 0) return sharpOrder.slice(0, fifths).includes(step) ? 1 : 0;
    if (fifths < 0) return [...sharpOrder].reverse().slice(0, -fifths).includes(step) ? -1 : 0;
    return 0;
}

/** One step along the scale of the key signature. */
export function moveDiatonic(pitch: Pitch, direction: 1 | -1, fifths: number): Pitch {
    let index = steps.indexOf(pitch.step) + direction;
    let octave = pitch.octave;
    if (index > 6) {
        index = 0;
        octave++;
    } else if (index < 0) {
        index = 6;
        octave--;
    }
    const step = steps[index];
    return { step, alter: keyAlter(step, fifths), octave };
}

/** One semitone, spelled with flats in flat keys or when moving down from a natural, otherwise sharps. */
export function moveChromatic(pitch: Pitch, direction: 1 | -1, fifths: number): Pitch {
    const value = pitch.octave * 12 + semitones[pitch.step] + pitch.alter + direction;
    const octave = Math.floor(value / 12);
    const semitone = value - octave * 12;
    const natural = steps.find((s) => semitones[s] === semitone);
    if (natural) return { step: natural, alter: 0, octave };

    const useFlats = fifths < 0 || (fifths === 0 && direction < 0);
    const step = steps.find((s) => semitones[s] === semitone + (useFlats ? 1 : -1)) as Step;
    return { step, alter: useFlats ? -1 : 1, octave };
}
