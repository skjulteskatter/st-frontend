import { IAfterSheetReadingModule } from "../../Interfaces";
import { MusicSheet } from "../../..";
export declare class DynamicsCalculator implements IAfterSheetReadingModule {
    /**
     * Adds existing expressions in the given source measure to the expression-lists (one list per staff):
     * @param musicSheet the current musicsheet
     * @param sourceMeasure the current source measure
     * @param dynListStaves lists per staff to store the expressions
     */
    private static fillDynamicsList;
    private static getOtherStaffIndexIfLinkedStavesAreDetected;
    /**
     * check for special case: an instrument (typ. piano) given as 2 separate Instruments with one staff (instead of 1 Instrument with 2 staves)
     * if so, let expressions react on both staves:
     */
    /**
     * Main function for calculating all volumes for all expressions
     * @param musicSheet
     */
    private static fillDynamicExpressions;
    /**
     * The interface main function: called when the musicsheet has been read.
     * @param musicSheet
     */
    calculate(musicSheet: MusicSheet): void;
}
