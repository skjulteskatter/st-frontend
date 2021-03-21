import { Note } from "./Note";
/**
 * A [[Beam]] - the bar grouping multiple consecutive [[Note]]s.
 */
export declare class Beam {
    private notes;
    private extendedNoteList;
    BeamNumber: number;
    BeamNumberOffsetToXML: number;
    constructor(beamNumber?: number, beamNumberOffsetToXML?: number);
    get Notes(): Note[];
    set Notes(value: Note[]);
    get ExtendedNoteList(): Note[];
    set ExtendedNoteList(value: Note[]);
    /**
     * Perform all the appropriate actions for adding a singleNote to the Beam.
     * @param note
     */
    addNoteToBeam(note: Note): void;
}
export declare enum BeamEnum {
    BeamNone = -1,
    BeamBegin = 0,
    BeamContinue = 1,
    BeamEnd = 2,
    BeamForward = 3,
    BeamBackward = 4
}
