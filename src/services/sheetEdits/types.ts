/**
 * Edits to a MusicXML sheet, stored in Firestore as `sheetEdits/{editId}` and
 * applied to the original file before rendering (by the backend when rendering
 * with `editId`, and by the editor for its live preview).
 *
 * Every edit is fully resolved, so applying it needs no music logic:
 * find the element at the address, check it still matches `from`, replace with `to`.
 *
 * Addressing within a part:
 * - `measure`: 0-based index of the `<measure>` element in the part (not its `number` attribute).
 * - `offset`: position in the measure in whole notes, as a reduced fraction [numerator, denominator].
 *   Computed by walking the measure's children: a `<note>` without `<chord/>` or `<grace/>`
 *   advances the position by its `<duration>`, `<chord/>` notes start where the previous note did,
 *   `<backup>`/`<forward>` move it back/forward. Durations are in the current `<divisions>`
 *   per quarter note, so whole notes = duration / (4 * divisions).
 *   A `<harmony>` is at the current position plus its optional `<offset>` child.
 */

export type Step = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type Fraction = [number, number];

export type Pitch = {
    step: Step;
    alter: number;
    octave: number;
};

export type HarmonyRoot = {
    step: Step;
    alter: number;
};

export type HarmonyDegree = {
    value: number;
    alter: number;
    type: "add" | "alter" | "subtract";
};

export type Harmony = {
    /** The chord as written by the user, e.g. "F#m7/C#". Display only. */
    text: string;
    root: HarmonyRoot;
    /** MusicXML `<kind>` value, e.g. "minor-seventh". */
    kind: string;
    /** `<kind text="...">`: the suffix as it should be printed, e.g. "m7". */
    kindText: string;
    bass?: HarmonyRoot;
    degrees?: HarmonyDegree[];
};

/**
 * Sets, adds (`from: null`) or removes (`to: null`) the chord symbol at a position.
 * Applying: remove the matching `<harmony>`'s root/kind/inversion/bass/degree children and write
 * the new ones, or insert a new `<harmony>` before the first `<note>` at `offset`. Where no note
 * starts (e.g. beat 3 of a whole note), add `<backup>`, `<harmony>`, `<forward>` at the end of the
 * measure (before closing barlines), moving back to `offset` and forward again.
 * `from` is checked on root, kind and bass.
 */
export type ChordEdit = {
    type: "chord";
    part: string;
    measure: number;
    offset: Fraction;
    from: Harmony | null;
    to: Harmony | null;
};

/**
 * Changes the pitch of one note. Applying: find the non-grace `<note>` with this voice, offset and
 * current pitch equal to `from`, set `<pitch>` to `to` and remove its `<accidental>` (the renderer
 * works out accidentals from pitch and key). Tied notes get one edit each.
 */
export type PitchEdit = {
    type: "pitch";
    part: string;
    measure: number;
    /** `<voice>` value, "1" when the note has none. */
    voice: string;
    offset: Fraction;
    from: Pitch;
    to: Pitch;
};

export type SheetEdit = ChordEdit | PitchEdit;

export type SheetEdits = {
    id: string;
    ownerId: string;
    /** Id of the sheet music file the edits apply to. */
    fileId: string;
    name: string;
    /** SHA-256 of the original MusicXML when the edits were made, to detect a replaced file. */
    baseHash: string;
    edits: SheetEdit[];
    createdAt: Date;
    updatedAt: Date;
};
