import { GraphicalLine } from "./GraphicalLine";
import { StaffLine } from "./StaffLine";
import { GraphicalMeasure } from "./GraphicalMeasure";
import { ContinuousDynamicExpression } from "../VoiceData/Expressions/ContinuousExpressions/ContinuousDynamicExpression";
import { AbstractGraphicalExpression } from "./AbstractGraphicalExpression";
import { ISqueezable } from "./ISqueezable";
import { SourceMeasure } from "../VoiceData/SourceMeasure";
/**
 * This class prepares the graphical elements for a continuous expression. It calculates the wedges and
 * wrappings if they are split over system breaks.
 */
export declare class GraphicalContinuousDynamicExpression extends AbstractGraphicalExpression implements ISqueezable {
    /** True if expression is split over system borders */
    private isSplittedPart;
    /** True if this expression should not be removed if re-rendered */
    private notToBeRemoved;
    /** Holds the line objects that can be drawn via implementation */
    private lines;
    private startMeasure;
    private endMeasure;
    /**
     * Create a new instance of the GraphicalContinuousDynamicExpression
     * @param continuousDynamic The continuous dynamic instruction read via ExpressionReader
     * @param staffLine The staffline where the expression is attached
     */
    constructor(continuousDynamic: ContinuousDynamicExpression, staffLine: StaffLine, measure: SourceMeasure);
    /** The graphical measure where the parent continuous dynamic expression starts */
    get StartMeasure(): GraphicalMeasure;
    set StartMeasure(value: GraphicalMeasure);
    /** The graphical measure where the parent continuous dynamic expression ends */
    get EndMeasure(): GraphicalMeasure;
    set EndMeasure(value: GraphicalMeasure);
    /** The staff lin where the graphical dynamic expressions ends */
    get EndStaffLine(): StaffLine;
    /**  Is true if this continuous expression is a wedge, that reaches over a system border and needs to be split into two. */
    get IsSplittedPart(): boolean;
    set IsSplittedPart(value: boolean);
    /**  Is true if the dynamic is not a symbol but a text instruction. E.g. "decrescendo" */
    get IsVerbal(): boolean;
    /** True if this expression should not be removed if re-rendered */
    get NotToBeRemoved(): boolean;
    set NotToBeRemoved(value: boolean);
    /** Holds the line objects that can be drawn via implementation */
    get Lines(): GraphicalLine[];
    get ContinuousDynamic(): ContinuousDynamicExpression;
    updateSkyBottomLine(): void;
    /**
     * Calculate crescendo lines for (full).
     * @param startX left most starting point
     * @param endX right mist ending point
     * @param y y placement
     * @param wedgeOpeningLength length of the opening
     * @param wedgeLineWidth line width of the wedge
     */
    createCrescendoLines(startX: number, endX: number, y: number, wedgeOpeningLength?: number, wedgeLineWidth?: number): void;
    /**
     * Calculate crescendo lines for system break (first part).
     * @param startX left most starting point
     * @param endX right mist ending point
     * @param y y placement
     * @param wedgeMeasureEndOpeningLength length of opening at measure end
     * @param wedgeOpeningLength length of the opening
     * @param wedgeLineWidth line width of the wedge
     */
    createFirstHalfCrescendoLines(startX: number, endX: number, y: number, wedgeMeasureEndOpeningLength?: number, wedgeLineWidth?: number): void;
    /**
     * Calculate crescendo lines for system break (second part).
     * @param startX left most starting point
     * @param endX right mist ending point
     * @param y y placement
     * @param wedgeMeasureBeginOpeningLength length of opening at measure start
     * @param wedgeOpeningLength length of the opening
     * @param wedgeLineWidth line width of the wedge
     */
    createSecondHalfCrescendoLines(startX: number, endX: number, y: number, wedgeMeasureBeginOpeningLength?: number, wedgeOpeningLength?: number, wedgeLineWidth?: number): void;
    /**
     * This method recalculates the Crescendo Lines (for all cases).
     * @param startX left most starting point
     * @param endX right most ending point
     * @param y y placement
     */
    recalculateCrescendoLines(startX: number, endX: number, y: number): void;
    /**
     * Calculate diminuendo lines for system break (full).
     * @param startX left most starting point
     * @param endX right mist ending point
     * @param y y placement
     * @param wedgeOpeningLength length of the opening
     * @param wedgeLineWidth line width of the wedge
     */
    createDiminuendoLines(startX: number, endX: number, y: number, wedgeOpeningLength?: number, wedgeLineWidth?: number): void;
    /**
     * Calculate diminuendo lines for system break (first part).
     * @param startX left most starting point
     * @param endX right mist ending point
     * @param y y placement
     * @param wedgeOpeningLength length of the opening
     * @param wedgeMeasureEndOpeningLength length of opening at measure end
     * @param wedgeLineWidth line width of the wedge
     */
    createFirstHalfDiminuendoLines(startX: number, endX: number, y: number, wedgeOpeningLength?: number, wedgeMeasureEndOpeningLength?: number, wedgeLineWidth?: number): void;
    /**
     * Calculate diminuendo lines for system break (second part).
     * @param startX left most starting point
     * @param endX right mist ending point
     * @param y y placement
     * @param wedgeMeasureBeginOpeningLength length of opening at measure start
     * @param wedgeLineWidth line width of the wedge
     */
    createSecondHalfDiminuendoLines(startX: number, endX: number, y: number, wedgeMeasureBeginOpeningLength?: number, wedgeLineWidth?: number): void;
    /**
     * This method recalculates the diminuendo lines (for all cases).
     * @param startX left most starting point
     * @param endX right most ending point
     * @param y y placement
     */
    recalculateDiminuendoLines(startX: number, endX: number, yPosition: number): void;
    /**
     * Calculate the BoundingBox (as a box around the Wedge).
     */
    calcPsi(): void;
    /**
     * Clear Lines
     */
    cleanUp(): void;
    /**
     * Shift wedge in y position
     * @param shift Number to shift
     */
    shiftYPosition(shift: number): void;
    squeeze(value: number): void;
    /**
     * Create lines from points and add them to the memory
     * @param wedgePoint start of the expression
     * @param upperWedgeEnd end of the upper line
     * @param lowerWedgeEnd end of lower line
     * @param wedgeLineWidth line width
     */
    private addWedgeLines;
    /**
     * Create top and bottom lines for continuing wedges
     * @param upperLineStart start of the upper line
     * @param upperLineEnd end of the upper line
     * @param lowerLineStart start of the lower line
     * @param lowerLineEnd end of lower line
     * @param wedgeLineWidth line width
     */
    private addDoubleLines;
}
