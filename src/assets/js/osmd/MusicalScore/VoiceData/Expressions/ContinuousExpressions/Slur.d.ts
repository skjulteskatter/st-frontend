import { Note } from "../../Note";
import { PlacementEnum } from "../AbstractExpression";
export declare class Slur {
    constructor();
    private startNote;
    private endNote;
    PlacementXml: PlacementEnum;
    get StartNote(): Note;
    set StartNote(value: Note);
    get EndNote(): Note;
    set EndNote(value: Note);
    startNoteHasMoreStartingSlurs(): boolean;
    endNoteHasMoreEndingSlurs(): boolean;
    isCrossed(): boolean;
    isSlurLonger(): boolean;
}
