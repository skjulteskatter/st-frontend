import { Instrument } from "../Instrument";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
import { KeyInstruction } from "../VoiceData/Instructions/KeyInstruction";
import { RhythmInstruction } from "../VoiceData/Instructions/RhythmInstruction";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { IXmlElement } from "../../Common/FileIO/Xml";
import { RepetitionInstructionReader } from "./MusicSymbolModules/RepetitionInstructionReader";
import { ReaderPluginManager } from "./ReaderPluginManager";
/**
 * An InstrumentReader is used during the reading phase to keep parsing new measures from the MusicXML file
 * with the readNextXmlMeasure method.
 */
export declare class InstrumentReader {
    constructor(pluginManager: ReaderPluginManager, repetitionInstructionReader: RepetitionInstructionReader, xmlMeasureList: IXmlElement[], instrument: Instrument);
    private repetitionInstructionReader;
    private xmlMeasureList;
    private musicSheet;
    private slurReader;
    pluginManager: ReaderPluginManager;
    private instrument;
    private voiceGeneratorsDict;
    private staffMainVoiceGeneratorDict;
    private inSourceMeasureInstrumentIndex;
    private divisions;
    private currentMeasure;
    private previousMeasure;
    private currentClefNumber;
    private currentXmlMeasureIndex;
    private currentStaff;
    private currentStaffEntry;
    private activeClefs;
    private activeKey;
    private activeRhythm;
    private activeClefsHaveBeenInitialized;
    private activeKeyHasBeenInitialized;
    private abstractInstructions;
    private openChordSymbolContainers;
    private expressionReaders;
    private currentVoiceGenerator;
    private maxTieNoteFraction;
    get ActiveKey(): KeyInstruction;
    get MaxTieNoteFraction(): Fraction;
    get ActiveRhythm(): RhythmInstruction;
    set ActiveRhythm(value: RhythmInstruction);
    /**
     * Main CreateSheet: read the next XML Measure and save all data to the given [[SourceMeasure]].
     * @param currentMeasure
     * @param measureStartAbsoluteTimestamp - Using this instead of currentMeasure.AbsoluteTimestamp as it isn't set yet
     * @param octavePlusOne Software like Guitar Pro gives one octave too low, so we need to add one
     * @returns {boolean}
     */
    readNextXmlMeasure(currentMeasure: SourceMeasure, measureStartAbsoluteTimestamp: Fraction, octavePlusOne: boolean): boolean;
    /** Parse a color in XML format. Can be #ARGB or #RGB format, colors as byte hex values.
     *  @return color in Vexflow format #[A]RGB or undefined for invalid xmlColorString
     */
    parseXmlColor(xmlColorString: string): string;
    doCalculationsAfterDurationHasBeenSet(): void;
    /**
     * Get or create the passing [[VoiceGenerator]].
     * @param voiceId
     * @param staffId
     * @returns {VoiceGenerator}
     */
    private getOrCreateVoiceGenerator;
    private createExpressionGenerators;
    /**
     * Create the default [[ClefInstruction]] for the given staff index.
     * @param staffIndex
     */
    private createDefaultClefInstruction;
    /**
     * Create the default [[KeyInstruction]] in case no [[KeyInstruction]] is given in the whole [[Instrument]].
     */
    private createDefaultKeyInstruction;
    /**
     * Check if the given attributesNode is at the begin of a XmlMeasure.
     * @param parentNode
     * @param attributesNode
     * @returns {boolean}
     */
    private isAttributesNodeAtBeginOfMeasure;
    /**
     * Check if the given attributesNode is at the end of a XmlMeasure.
     * @param parentNode
     * @param attributesNode
     * @returns {boolean}
     */
    private isAttributesNodeAtEndOfMeasure;
    /**
     * Called only when no noteDuration is given in XML.
     * @param xmlNode
     * @returns {Fraction}
     */
    private getNoteDurationFromTypeNode;
    /**
     * Add (the three basic) Notation Instructions to a list
     * @param attrNode
     * @param guitarPro
     */
    private addAbstractInstruction;
    /**
     * Save the current AbstractInstructions to the corresponding [[StaffEntry]]s.
     * @param numberOfStaves
     * @param beginOfMeasure
     */
    private saveAbstractInstructionList;
    /**
     * Save any ClefInstruction given - exceptionally - at the end of the currentMeasure.
     */
    private saveClefInstructionAtEndOfMeasure;
    /**
     * In case of a [[Tuplet]], read NoteDuration from type.
     * @param xmlNode
     * @returns {Fraction}
     */
    private getNoteDurationForTuplet;
    private readExpressionStaffNumber;
    /**
     * Calculate the divisions value from the type and duration of the first MeasureNote that makes sense
     * (meaning itself hasn't any errors and it doesn't belong to a [[Tuplet]]).
     *
     * If all the MeasureNotes belong to a [[Tuplet]], then we read the next XmlMeasure (and so on...).
     * If we have reached the end of the [[Instrument]] and still the divisions aren't set, we throw an exception
     * @returns {number}
     */
    private readDivisionsFromNotes;
}
