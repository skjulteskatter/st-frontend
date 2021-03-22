import { MusicSheet } from "../MusicSheet";
import { IXmlElement } from "../../Common/FileIO/Xml";
import { IAfterSheetReadingModule } from "../Interfaces/IAfterSheetReadingModule";
import { EngravingRules } from "../Graphical/EngravingRules";
import { ReaderPluginManager } from "./ReaderPluginManager";
export declare class MusicSheetReader {
    constructor(afterSheetReadingModules?: IAfterSheetReadingModule[], rules?: EngravingRules);
    private repetitionInstructionReader;
    private repetitionCalculator;
    private afterSheetReadingModules;
    private musicSheet;
    private completeNumberOfStaves;
    private currentMeasure;
    private previousMeasure;
    private currentFraction;
    private pluginManager;
    rules: EngravingRules;
    get PluginManager(): ReaderPluginManager;
    get CompleteNumberOfStaves(): number;
    private static doCalculationsAfterDurationHasBeenSet;
    /**
     * Read a music XML file and saves the values in the MusicSheet class.
     * @param root
     * @param path
     * @returns {MusicSheet}
     */
    createMusicSheet(root: IXmlElement, path: string): MusicSheet;
    private _removeFromArray;
    private trimString;
    private _lastElement;
    private _createMusicSheet;
    private initializeReading;
    /**
     * Check if all (should there be any apart from the first Measure) [[RhythmInstruction]]s in the [[SourceMeasure]] are the same.
     *
     * If not, then the max [[RhythmInstruction]] (Fraction) is set to all staves.
     * Also, if it happens to have the same [[RhythmInstruction]]s in RealValue but given in Symbol AND Fraction, then the Fraction prevails.
     * @param instrumentReaders
     */
    private checkIfRhythmInstructionsAreSetAndEqual;
    /**
     * True in case of 4/4 and COMMON TIME (or 2/2 and CUT TIME)
     * @param rhythmInstructions
     * @returns {boolean}
     */
    private areRhythmInstructionsMixed;
    /**
     * Set the [[Measure]]'s duration taking into account the longest [[Instrument]] duration and the active Rhythm read from XML.
     * @param instrumentReaders
     * @param sourceMeasureCounter
     * @returns {number}
     */
    private setSourceMeasureDuration;
    /**
     * Check the Fractions for Equivalence and if so, sets maxInstrumentDuration's members accordingly.
     * *
     * Example: if maxInstrumentDuration = 1/1 and sourceMeasureDuration = 4/4, maxInstrumentDuration becomes 4/4.
     * @param maxInstrumentDuration
     * @param activeRhythm
     */
    private checkFractionsForEquivalence;
    /**
     * Handle the case of an implicit [[SourceMeasure]].
     * @param maxInstrumentDuration
     * @param activeRhythm
     * @returns {boolean}
     */
    private checkIfMeasureIsImplicit;
    /**
     * Check the Duration of all the given Instruments.
     * @param instrumentsDurations
     * @param maxInstrumentDuration
     * @returns {boolean}
     */
    private allInstrumentsHaveSameDuration;
    private graphicalMeasureIsEmpty;
    /**
     * Check a [[SourceMeasure]] for possible empty / undefined entries ([[VoiceEntry]], [[SourceStaffEntry]], VerticalContainer)
     * (caused from TieAlgorithm removing EndTieNote) and removes them if completely empty / null
     */
    private checkSourceMeasureForNullEntries;
    /**
     * Read the XML file and creates the main sheet Labels.
     * @param root
     * @param filePath
     */
    private pushSheetLabels;
    private presentAttrsWithValue;
    private readComposer;
    private readTitleAndComposerFromCredits;
    private computeSystemYCoordinates;
    private readTitle;
    /**
     * Build the [[InstrumentalGroup]]s and [[Instrument]]s.
     * @param entryList
     * @returns {{}}
     */
    private createInstrumentGroups;
    /**
     * Read from each xmlInstrumentPart the first xmlMeasure in order to find out the [[Instrument]]'s number of Staves
     * @param partInst
     * @returns {number} - Complete number of Staves for all Instruments.
     */
    private getCompleteNumberOfStavesFromXml;
    /**
     * Read from XML for a single [[Instrument]] the first xmlMeasure in order to find out the Instrument's number of Staves.
     * @param partNode
     * @returns {number}
     */
    private getInstrumentNumberOfStavesFromXml;
}
