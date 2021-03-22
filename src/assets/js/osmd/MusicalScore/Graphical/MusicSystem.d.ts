import { StaffLine } from "./StaffLine";
import { Instrument } from "../Instrument";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { InstrumentalGroup } from "../InstrumentalGroup";
import { GraphicalMusicPage } from "./GraphicalMusicPage";
import { GraphicalLabel } from "./GraphicalLabel";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { GraphicalObject } from "./GraphicalObject";
import { EngravingRules } from "./EngravingRules";
import { SystemLinesEnum } from "./SystemLinesEnum";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { GraphicalMarkedArea } from "./GraphicalMarkedArea";
import { SystemLine } from "./SystemLine";
import { SystemLinePosition } from "./SystemLinePosition";
/**
 * A MusicSystem contains the [[StaffLine]]s for all instruments, until a line break
 */
export declare abstract class MusicSystem extends GraphicalObject {
    needsToBeRedrawn: boolean;
    rules: EngravingRules;
    protected parent: GraphicalMusicPage;
    protected id: number;
    protected staffLines: StaffLine[];
    protected graphicalMeasures: GraphicalMeasure[][];
    /** Dictionary of (Instruments and) labels.
     * note that the key needs to be unique, GraphicalLabel is not unique yet.
     * That is why the labels are labels.values() and not labels.keys().
     */
    protected labels: Dictionary<Instrument, GraphicalLabel>;
    protected measureNumberLabels: GraphicalLabel[];
    protected maxLabelLength: number;
    protected objectsToRedraw: [Object[], Object][];
    protected instrumentBrackets: GraphicalObject[];
    protected groupBrackets: GraphicalObject[];
    protected graphicalMarkedAreas: GraphicalMarkedArea[];
    protected systemLines: SystemLine[];
    breaksPage: boolean;
    constructor(id: number);
    get Parent(): GraphicalMusicPage;
    set Parent(value: GraphicalMusicPage);
    get NextSystem(): MusicSystem;
    get StaffLines(): StaffLine[];
    get GraphicalMeasures(): GraphicalMeasure[][];
    get MeasureNumberLabels(): GraphicalLabel[];
    get Labels(): GraphicalLabel[];
    get ObjectsToRedraw(): [Object[], Object][];
    get InstrumentBrackets(): GraphicalObject[];
    get GroupBrackets(): GraphicalObject[];
    get GraphicalMarkedAreas(): GraphicalMarkedArea[];
    get SystemLines(): SystemLine[];
    get Id(): number;
    /**
     * Create the left vertical Line connecting all staves of the [[MusicSystem]].
     * @param lineWidth
     * @param systemLabelsRightMargin
     */
    createSystemLeftLine(lineWidth: number, systemLabelsRightMargin: number, isFirstSystem: boolean): void;
    /**
     * Create the vertical Lines after the End of all [[StaffLine]]'s Measures
     * @param xPosition
     * @param lineWidth
     * @param lineType
     * @param linePosition indicates if the line belongs to start or end of measure
     * @param measureIndex the measure index within the staffline
     * @param measure
     */
    createVerticalLineForMeasure(xPosition: number, lineWidth: number, lineType: SystemLinesEnum, linePosition: SystemLinePosition, measureIndex: number, measure: GraphicalMeasure): void;
    /**
     * Set the y-Positions of all the system lines in the system and creates the graphical Lines and dots within.
     * @param rules
     */
    setYPositionsToVerticalLineObjectsAndCreateLines(rules: EngravingRules): void;
    calculateBorders(rules: EngravingRules): void;
    alignBeginInstructions(): void;
    GetLeftBorderAbsoluteXPosition(): number;
    GetRightBorderAbsoluteXPosition(): number;
    AddGraphicalMeasures(graphicalMeasures: GraphicalMeasure[]): void;
    GetSystemsFirstTimeStamp(): Fraction;
    GetSystemsLastTimeStamp(): Fraction;
    /**
     * Create an InstrumentBracket for each multiStave Instrument.
     * @param instruments
     * @param staffHeight
     */
    createInstrumentBrackets(instruments: Instrument[], staffHeight: number): void;
    /**
     * Create a GroupBracket for an [[InstrumentalGroup]].
     * @param instrumentGroups
     * @param staffHeight
     * @param recursionDepth
     */
    createGroupBrackets(instrumentGroups: InstrumentalGroup[], staffHeight: number, recursionDepth: number): void;
    /**
     * Create the Instrument's Labels (only for the first [[MusicSystem]] of the first MusicPage).
     * @param instrumentLabelTextHeight
     * @param systemLabelsRightMargin
     * @param labelMarginBorderFactor
     */
    createMusicSystemLabel(instrumentLabelTextHeight: number, systemLabelsRightMargin: number, labelMarginBorderFactor: number, isFirstSystem?: boolean): void;
    /**
     * Set the Y-Positions for the MusicSystem's Labels.
     */
    setMusicSystemLabelsYPosition(): void;
    /**
     * Check if two "adjacent" StaffLines have BOTH a StaffEntry with a StaffEntryLink.
     * This is needed for the y-spacing algorithm.
     * @returns {boolean}
     */
    checkStaffEntriesForStaffEntryLink(): boolean;
    getBottomStaffLine(topStaffLine: StaffLine): StaffLine;
    /**
     * Here the system line is generated, which acts as the container of graphical lines and dots that will be finally rendered.
     * It holds al the logical parameters of the system line.
     * @param xPosition The x position within the system
     * @param lineWidth The total x width
     * @param lineType The line type enum
     * @param linePosition indicates if the line belongs to start or end of measure
     * @param musicSystem
     * @param topMeasure
     * @param bottomMeasure
     */
    protected createSystemLine(xPosition: number, lineWidth: number, lineType: SystemLinesEnum, linePosition: SystemLinePosition, musicSystem: MusicSystem, topMeasure: GraphicalMeasure, bottomMeasure?: GraphicalMeasure): SystemLine;
    /**
     * Create all the graphical lines and dots needed to render a system line (e.g. bold-thin-dots..).
     * @param systemLine
     */
    protected createLinesForSystemLine(systemLine: SystemLine): void;
    /**
     * Calculates the summed x-width of a possibly given Instrument Brace and/or Group Bracket(s).
     * @returns {number} the x-width
     */
    protected calcBracketsWidth(): number;
    protected createInstrumentBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine): void;
    protected createGroupBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine, recursionDepth: number): void;
    private findFirstVisibleInstrumentInInstrumentalGroup;
    private findLastVisibleInstrumentInInstrumentalGroup;
    /**
     * Update the xPosition of the [[MusicSystem]]'s [[StaffLine]]'s due to [[Label]] positioning.
     * @param systemLabelsRightMargin
     */
    private updateMusicSystemStaffLineXPosition;
}
