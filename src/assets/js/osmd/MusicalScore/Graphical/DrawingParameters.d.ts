import { EngravingRules } from "./EngravingRules";
import { PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
export declare enum ColoringModes {
    XML = 0,
    AutoColoring = 1,
    CustomColorSet = 2
}
export declare enum DrawingParametersEnum {
    allon = "allon",
    compact = "compact",
    compacttight = "compacttight",
    default = "default",
    leadsheet = "leadsheet",
    preview = "preview",
    thumbnail = "thumbnail"
}
/** Internal drawing/rendering parameters and broad modes like compact and thumbnail. Overlap with EngravingRules. */
export declare class DrawingParameters {
    /** will set other settings if changed with set method */
    private drawingParametersEnum;
    private rules;
    drawHighlights: boolean;
    drawErrors: boolean;
    drawSelectionStartSymbol: boolean;
    drawSelectionEndSymbol: boolean;
    drawCursors: boolean;
    drawActivitySymbols: boolean;
    drawScrollIndicator: boolean;
    drawAnnotations: boolean;
    drawComments: boolean;
    drawMarkedAreas: boolean;
    drawTitle: boolean;
    drawSubtitle: boolean;
    drawLyricist: boolean;
    drawComposer: boolean;
    drawCredits: boolean;
    drawPartNames: boolean;
    coloringMode: ColoringModes;
    fingeringPosition: PlacementEnum;
    /** Draw notes set to be invisible (print-object="no" in XML). */
    drawHiddenNotes: boolean;
    constructor(drawingParameters?: DrawingParametersEnum);
    /** Sets drawing parameters enum and changes settings flags accordingly. */
    set DrawingParametersEnum(drawingParametersEnum: DrawingParametersEnum);
    get DrawingParametersEnum(): DrawingParametersEnum;
    setForAllOn(): void;
    setForDefault(): void;
    setForThumbnail(): void;
    setForCompactMode(): void;
    setForCompactTightMode(): void;
    setForLeadsheet(): void;
    get DrawCredits(): boolean;
    set DrawCredits(value: boolean);
    get DrawTitle(): boolean;
    /** Enable or disable drawing the Title of the piece. If disabled, will disable drawing Subtitle as well. */
    set DrawTitle(value: boolean);
    get DrawSubtitle(): boolean;
    /** Enable or disable drawing the Subtitle of the piece. If enabled, will enable drawing Title as well. */
    set DrawSubtitle(value: boolean);
    get DrawComposer(): boolean;
    /** Enable or disable drawing a label for the Composer of the piece. */
    set DrawComposer(value: boolean);
    get DrawLyricist(): boolean;
    set DrawLyricist(value: boolean);
    get DrawPartNames(): boolean;
    set DrawPartNames(value: boolean);
    get FingeringPosition(): PlacementEnum;
    set FingeringPosition(value: PlacementEnum);
    get Rules(): EngravingRules;
    set Rules(value: EngravingRules);
}
