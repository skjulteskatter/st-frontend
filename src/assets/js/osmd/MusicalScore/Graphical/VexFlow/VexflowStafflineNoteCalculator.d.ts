import { IStafflineNoteCalculator } from "../../Interfaces/IStafflineNoteCalculator";
import { GraphicalNote } from "../GraphicalNote";
import { EngravingRules } from "../EngravingRules";
export declare class VexflowStafflineNoteCalculator implements IStafflineNoteCalculator {
    private rules;
    private staffPitchListMapping;
    private baseLineNote;
    private baseLineOctave;
    constructor(rules: EngravingRules);
    /**
     * This method is called for each note during the calc phase. We want to track all possible positions to make decisions
     * during layout about where notes should be positioned.
     * This directly puts notes that share a line to the same position, regardless of voice
     * @param graphicalNote The note to be checked/positioned
     * @param staffIndex The staffline the note is on
     */
    trackNote(graphicalNote: GraphicalNote): void;
    private static PitchIndexOf;
    private static findOrInsert;
    /**
     * This method is called for each note, and should make any necessary position changes based on the number of stafflines, clef, etc.
     * @param graphicalNote The note to be checked/positioned
     * @param staffIndex The staffline that this note exists on
     * @returns the newly positioned note
     */
    positionNote(graphicalNote: GraphicalNote): GraphicalNote;
    /**
     * Get the number of unique "voices" or note positions
     * @param staffIndex The Staffline to get the count of
     */
    getStafflineUniquePositionCount(staffIndex: number): number;
}
