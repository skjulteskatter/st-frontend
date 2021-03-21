import { Tie } from "../VoiceData/Tie";
import { GraphicalNote } from "./GraphicalNote";
/**
 * The graphical counterpart of a [[Tie]].
 */
export declare class GraphicalTie {
    private tie;
    private startNote;
    private endNote;
    constructor(tie: Tie, start?: GraphicalNote, end?: GraphicalNote);
    get GetTie(): Tie;
    get StartNote(): GraphicalNote;
    get Tie(): Tie;
    set StartNote(value: GraphicalNote);
    get EndNote(): GraphicalNote;
    set EndNote(value: GraphicalNote);
}
