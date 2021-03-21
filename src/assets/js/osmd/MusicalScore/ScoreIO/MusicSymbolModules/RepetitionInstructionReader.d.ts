import { MusicSheet } from "../../MusicSheet";
import { IXmlElement } from "../../../Common/FileIO/Xml";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
import { RepetitionInstruction } from "../../VoiceData/Instructions/RepetitionInstruction";
export declare class RepetitionInstructionReader {
    /**
     * A global list of all repetition instructions in the musicsheet.
     */
    repetitionInstructions: RepetitionInstruction[];
    xmlMeasureList: IXmlElement[][];
    private musicSheet;
    private currentMeasureIndex;
    set MusicSheet(value: MusicSheet);
    /**
     * is called when starting reading an xml measure
     * @param measure
     * @param currentMeasureIndex
     */
    prepareReadingMeasure(measure: SourceMeasure, currentMeasureIndex: number): void;
    handleLineRepetitionInstructions(barlineNode: IXmlElement): boolean;
    handleRepetitionInstructionsFromWordsOrSymbols(directionTypeNode: IXmlElement, relativeMeasurePosition: number): boolean;
    removeRedundantInstructions(): void;
    private findInstructionInPreviousMeasure;
    private backwardSearchForPreviousIdenticalInstruction;
    private addInstruction;
}
