import { Note } from "./Note";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { VoiceEntry } from "./VoiceEntry";
import { SourceStaffEntry } from "./SourceStaffEntry";
import { Pitch } from "../../Common/DataObjects/Pitch";
import { SourceMeasure } from "./SourceMeasure";
export declare class TabNote extends Note {
    constructor(voiceEntry: VoiceEntry, parentStaffEntry: SourceStaffEntry, length: Fraction, pitch: Pitch, sourceMeasure: SourceMeasure, stringNumber: number, fretNumber: number, bendArray: {
        bendalter: number;
        direction: string;
    }[], vibratoStroke: boolean);
    private stringNumberTab;
    private fretNumber;
    private bendArray;
    private vibratoStroke;
    /** Returns the string number the note should be played on. Note there can also be violin string numbers in treble clef. */
    get StringNumberTab(): number;
    get FretNumber(): number;
    get BendArray(): {
        bendalter: number;
        direction: string;
    }[];
    get VibratoStroke(): boolean;
}
