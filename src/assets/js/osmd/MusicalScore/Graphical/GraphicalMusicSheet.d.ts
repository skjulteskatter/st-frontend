import { MusicSheet } from "../MusicSheet";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { GraphicalMusicPage } from "./GraphicalMusicPage";
import { VerticalGraphicalStaffEntryContainer } from "./VerticalGraphicalStaffEntryContainer";
import { GraphicalLabel } from "./GraphicalLabel";
import { GraphicalLine } from "./GraphicalLine";
import { MusicSystem } from "./MusicSystem";
import { GraphicalStaffEntry } from "./GraphicalStaffEntry";
import { SourceStaffEntry } from "../VoiceData/SourceStaffEntry";
import { PointF2D } from "../../Common/DataObjects/PointF2D";
import { ClefInstruction } from "../VoiceData/Instructions/ClefInstruction";
import { KeyInstruction } from "../VoiceData/Instructions/KeyInstruction";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { GraphicalNote } from "./GraphicalNote";
import { MusicSheetCalculator } from "./MusicSheetCalculator";
import { SelectionStartSymbol } from "./SelectionStartSymbol";
import { SelectionEndSymbol } from "./SelectionEndSymbol";
import { OutlineAndFillStyleEnum } from "./DrawingEnums";
import { Clickable } from "./Clickable";
import { MusicSheetDrawer } from "./MusicSheetDrawer";
import { GraphicalVoiceEntry } from "./GraphicalVoiceEntry";
/**
 * The graphical counterpart of a [[MusicSheet]]
 */
export declare class GraphicalMusicSheet {
    constructor(musicSheet: MusicSheet, calculator: MusicSheetCalculator);
    private musicSheet;
    private calculator;
    drawer: MusicSheetDrawer;
    private musicPages;
    /** measures (i,j) where i is the measure number and j the staff index (e.g. staff indices 0, 1 for two piano parts) */
    private measureList;
    private verticalGraphicalStaffEntryContainers;
    private title;
    private subtitle;
    private composer;
    private lyricist;
    private cursors;
    private selectionStartSymbol;
    private selectionEndSymbol;
    private minAllowedSystemWidth;
    private numberOfStaves;
    private leadSheet;
    get ParentMusicSheet(): MusicSheet;
    get GetCalculator(): MusicSheetCalculator;
    get MusicPages(): GraphicalMusicPage[];
    set MusicPages(value: GraphicalMusicPage[]);
    get MeasureList(): GraphicalMeasure[][];
    set MeasureList(value: GraphicalMeasure[][]);
    get VerticalGraphicalStaffEntryContainers(): VerticalGraphicalStaffEntryContainer[];
    set VerticalGraphicalStaffEntryContainers(value: VerticalGraphicalStaffEntryContainer[]);
    get Title(): GraphicalLabel;
    set Title(value: GraphicalLabel);
    get Subtitle(): GraphicalLabel;
    set Subtitle(value: GraphicalLabel);
    get Composer(): GraphicalLabel;
    set Composer(value: GraphicalLabel);
    get Lyricist(): GraphicalLabel;
    set Lyricist(value: GraphicalLabel);
    get Cursors(): GraphicalLine[];
    get SelectionStartSymbol(): SelectionStartSymbol;
    get SelectionEndSymbol(): SelectionEndSymbol;
    get MinAllowedSystemWidth(): number;
    set MinAllowedSystemWidth(value: number);
    get NumberOfStaves(): number;
    get LeadSheet(): boolean;
    set LeadSheet(value: boolean);
    /**
     * Calculate the Absolute Positions from the Relative Positions.
     * @param graphicalMusicSheet
     */
    static transformRelativeToAbsolutePosition(graphicalMusicSheet: GraphicalMusicSheet): void;
    Initialize(): void;
    reCalculate(): void;
    EnforceRedrawOfMusicSystems(): void;
    getClickedObject<T>(positionOnMusicSheet: PointF2D): T;
    findGraphicalMeasure(measureIndex: number, staffIndex: number): GraphicalMeasure;
    /**
     * Search the MeasureList for a certain GraphicalStaffEntry with the given SourceStaffEntry,
     * at a certain verticalIndex (eg a corresponding Staff), starting at a specific horizontalIndex (eg specific GraphicalMeasure).
     * @param staffIndex
     * @param measureIndex
     * @param sourceStaffEntry
     * @returns {any}
     */
    findGraphicalStaffEntryFromMeasureList(staffIndex: number, measureIndex: number, sourceStaffEntry: SourceStaffEntry): GraphicalStaffEntry;
    /**
     * Return the next (to the right) not null GraphicalStaffEntry from a given Index.
     * @param staffIndex
     * @param measureIndex
     * @param graphicalStaffEntry
     * @returns {any}
     */
    findNextGraphicalStaffEntry(staffIndex: number, measureIndex: number, graphicalStaffEntry: GraphicalStaffEntry): GraphicalStaffEntry;
    getFirstVisibleMeasuresListFromIndices(start: number, end: number): GraphicalMeasure[];
    orderMeasuresByStaffLine(measures: GraphicalMeasure[]): GraphicalMeasure[][];
    /**
     * Return the active Clefs at the start of the first SourceMeasure.
     * @returns {ClefInstruction[]}
     */
    initializeActiveClefs(): ClefInstruction[];
    GetMainKey(): KeyInstruction;
    /**
     * Create the VerticalContainer and adds it to the List at the correct Timestamp position.
     * @param timestamp
     * @returns {any}
     */
    getOrCreateVerticalContainer(timestamp: Fraction): VerticalGraphicalStaffEntryContainer;
    /**
     * Does a binary search on the container list and returns the VerticalContainer with the given Timestamp.
     * The search begins at startIndex, if given.
     * If the timestamp cannot be found, null is returned.
     * @param timestamp - The timestamp for which the container shall be found.
     * @param startIndex - The index from which the search starts in the container list.
     * @returns {any}
     * @constructor
     */
    GetVerticalContainerFromTimestamp(timestamp: Fraction, startIndex?: number): VerticalGraphicalStaffEntryContainer;
    /**
     * Perform a binary search for the absolute given Timestamp in all the GraphicalVerticalContainers.
     * @param musicTimestamp
     * @returns {number}
     * @constructor
     */
    GetInterpolatedIndexInVerticalContainers(musicTimestamp: Fraction): number;
    /**
     * Get a List with the indices of all the visible GraphicalMeasures and calculates their
     * corresponding indices in the first SourceMeasure, taking into account Instruments with multiple Staves.
     * @param visibleMeasures
     * @returns {number[]}
     */
    getVisibleStavesIndicesFromSourceMeasure(visibleMeasures: GraphicalMeasure[]): number[];
    /**
     * Returns the GraphicalMeasure with the given SourceMeasure as Parent at the given staff index.
     * @param sourceMeasure
     * @param staffIndex
     * @returns {any}
     */
    getGraphicalMeasureFromSourceMeasureAndIndex(sourceMeasure: SourceMeasure, staffIndex: number): GraphicalMeasure;
    getLastGraphicalMeasureFromIndex(staffIndex: number, lastRendered?: boolean): GraphicalMeasure;
    getMeasureIndex(graphicalMeasure: GraphicalMeasure, measureIndex: number, inListIndex: number): boolean;
    /**
     * Generic method to find graphical objects on the sheet at a given location.
     * @param clickPosition Position in units where we are searching on the sheet
     * @param className String representation of the class we want to find. Must extend GraphicalObject
     * @param startSearchArea The area in units around our point to look for our graphical object, default 5
     * @param maxSearchArea The max area we want to search around our point
     * @param searchAreaIncrement The amount we expand our search area for each iteration that we don't find an object of the given type
     * @param shouldBeIncludedTest A callback that determines if the object should be included in our results- return false for no, true for yes
     */
    private GetNearestGraphicalObject;
    GetNearestVoiceEntry(clickPosition: PointF2D): GraphicalVoiceEntry;
    GetNearestNote(clickPosition: PointF2D, maxClickDist: PointF2D): GraphicalNote;
    domToSvg(point: PointF2D): PointF2D;
    svgToDom(point: PointF2D): PointF2D;
    svgToOsmd(point: PointF2D): PointF2D;
    private domToSvgTransform;
    GetClickableLabel(clickPosition: PointF2D): GraphicalLabel;
    GetPossibleCommentAnchor(clickPosition: PointF2D): SourceStaffEntry;
    GetClickedObjectOfType<T>(positionOnMusicSheet: PointF2D): T;
    GetClickedClickable(positionOnMusicSheet: PointF2D): Clickable;
    tryGetTimestampFromPosition(positionOnMusicSheet: PointF2D): Fraction;
    tryGetClickableLabel(positionOnMusicSheet: PointF2D): GraphicalLabel;
    tryGetTimeStampFromPosition(positionOnMusicSheet: PointF2D): Fraction;
    /**
     * Get visible staffentry for the container given by the index.
     * @param index
     * @returns {GraphicalStaffEntry}
     */
    getStaffEntry(index: number): GraphicalStaffEntry;
    /**
     * Returns the index of the closest previous (earlier) vertical container which has at least some visible staff entry, with respect to the given index.
     * @param index
     * @returns {number}
     * @constructor
     */
    GetPreviousVisibleContainerIndex(index: number): number;
    /**
     * Returns the index of the closest next (later) vertical container which has at least some visible staff entry, with respect to the given index.
     * @param index
     * @returns {number}
     * @constructor
     */
    GetNextVisibleContainerIndex(index: number): number;
    findClosestLeftStaffEntry(fractionalIndex: number, searchOnlyVisibleEntries: boolean): GraphicalStaffEntry;
    findClosestRightStaffEntry(fractionalIndex: number, returnOnlyVisibleEntries: boolean): GraphicalStaffEntry;
    calculateCursorLineAtTimestamp(musicTimestamp: Fraction, styleEnum: OutlineAndFillStyleEnum): GraphicalLine;
    calculateXPositionFromTimestamp(timeStamp: Fraction): [number, MusicSystem];
    calculateCursorPoints(xPos: number, correspondingSystem: MusicSystem): [PointF2D, PointF2D];
    GetNumberOfVisibleInstruments(): number;
    GetNumberOfFollowedInstruments(): number;
    GetGraphicalFromSourceStaffEntry(sourceStaffEntry: SourceStaffEntry): GraphicalStaffEntry;
    private CalculateDistance;
    /**
     * Return the longest StaffEntry duration from a GraphicalVerticalContainer.
     * @param index the index of the vertical container
     * @returns {Fraction}
     */
    private getLongestStaffEntryDuration;
}
export declare class SystemImageProperties {
    positionInPixels: PointF2D;
    systemImageId: number;
    system: MusicSystem;
}
