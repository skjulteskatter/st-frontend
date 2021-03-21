import { VoiceEntry } from "./VoiceEntry";
import { Note } from "./Note";
export declare class Arpeggio {
    constructor(parentVoiceEntry: VoiceEntry, type?: ArpeggioType);
    parentVoiceEntry: VoiceEntry;
    notes: Note[];
    type: ArpeggioType;
    addNote(note: Note): void;
}
/** Corresponds to Vex.Flow.Stroke.Type for now. But we don't want VexFlow as a dependency here. */
export declare enum ArpeggioType {
    BRUSH_DOWN = 1,
    BRUSH_UP = 2,
    ROLL_DOWN = 3,
    ROLL_UP = 4,
    RASQUEDO_DOWN = 5,
    RASQUEDO_UP = 6,
    ARPEGGIO_DIRECTIONLESS = 7
}
