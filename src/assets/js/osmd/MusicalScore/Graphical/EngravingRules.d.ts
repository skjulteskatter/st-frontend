import { PagePlacementEnum } from "./GraphicalMusicPage";
import { TextAlignmentEnum } from "../../Common/Enums/TextAlignment";
import { PlacementEnum } from "../VoiceData/Expressions/AbstractExpression";
import { AutoBeamOptions, FillEmptyMeasuresWithWholeRests } from "../../OpenSheetMusicDisplay/OSMDOptions";
import { ColoringModes as ColoringMode } from "./DrawingParameters";
import { Dictionary } from "typescript-collections";
import { FontStyles } from "../../Common/Enums";
import { NoteEnum } from "../../Common/DataObjects/Pitch";
import { ChordSymbolEnum, CustomChord } from "../../MusicalScore/VoiceData/ChordSymbolContainer";
import { GraphicalNote } from "./GraphicalNote";
import { Note } from "../VoiceData/Note";
/** Rendering and Engraving options, more fine-grained than [[IOSMDOptions]].
 *  Not all of these options are meant to be modified by users of the library,
 *  full support is only given for [[IOSMDOptions]].
 *  Nevertheless, there are many useful options here,
 *  like Render* to (not) render certain elements (e.g. osmd.rules.RenderRehearsalMarks = false)
 */
export declare class EngravingRules {
    /** A unit of distance. 1.0 is the distance between lines of a stave for OSMD, which is 10 pixels in Vexflow. */
    static unit: number;
    SamplingUnit: number;
    StaccatoShorteningFactor: number;
    /** Height (size) of the sheet title. */
    SheetTitleHeight: number;
    SheetSubtitleHeight: number;
    SheetMinimumDistanceBetweenTitleAndSubtitle: number;
    SheetComposerHeight: number;
    SheetAuthorHeight: number;
    CompactMode: boolean;
    PagePlacementEnum: PagePlacementEnum;
    PageHeight: number;
    PageTopMargin: number;
    PageTopMarginNarrow: number;
    PageBottomMargin: number;
    PageLeftMargin: number;
    PageRightMargin: number;
    TitleTopDistance: number;
    TitleBottomDistance: number;
    SystemLeftMargin: number;
    SystemRightMargin: number;
    SystemLabelsRightMargin: number;
    SystemComposerDistance: number;
    InstrumentLabelTextHeight: number;
    MinimumDistanceBetweenSystems: number;
    MinSkyBottomDistBetweenSystems: number;
    LastSystemMaxScalingFactor: number;
    StaffDistance: number;
    BetweenStaffDistance: number;
    StaffHeight: number;
    TabStaffInterlineHeight: number;
    BetweenStaffLinesDistance: number;
    /** Whether to automatically beam notes that don't already have beams in XML. */
    AutoBeamNotes: boolean;
    /** Options for autoBeaming like whether to beam over rests. See AutoBeamOptions interface. */
    AutoBeamOptions: AutoBeamOptions;
    BeamWidth: number;
    BeamSpaceWidth: number;
    BeamForwardLength: number;
    FlatBeams: boolean;
    FlatBeamOffset: number;
    FlatBeamOffsetPerBeam: number;
    ClefLeftMargin: number;
    ClefRightMargin: number;
    /** How many unique note positions a percussion score needs to have to not be rendered on one line. */
    PercussionOneLineCutoff: number;
    PercussionForceVoicesOneLineCutoff: number;
    PercussionOneLineUseXMLDisplayStep: boolean;
    PercussionOneLineXMLDisplayStepOctaveOffset: number;
    BetweenKeySymbolsDistance: number;
    KeyRightMargin: number;
    RhythmRightMargin: number;
    ShowRhythmAgainAfterPartEndOrFinalBarline: boolean;
    NewPartAndSystemAfterFinalBarline: boolean;
    InStaffClefScalingFactor: number;
    DistanceBetweenNaturalAndSymbolWhenCancelling: number;
    NoteHelperLinesOffset: number;
    MeasureLeftMargin: number;
    MeasureRightMargin: number;
    DistanceBetweenLastInstructionAndRepetitionBarline: number;
    ArpeggioDistance: number;
    IdealStemLength: number;
    StemNoteHeadBorderYOffset: number;
    StemWidth: number;
    StemMargin: number;
    StemMinLength: number;
    StemMaxLength: number;
    BeamSlopeMaxAngle: number;
    StemMinAllowedDistanceBetweenNoteHeadAndBeamLine: number;
    SetWantedStemDirectionByXml: boolean;
    GraceNoteScalingFactor: number;
    GraceNoteXOffset: number;
    WedgeOpeningLength: number;
    WedgeMeasureEndOpeningLength: number;
    WedgeMeasureBeginOpeningLength: number;
    WedgePlacementAboveY: number;
    WedgePlacementBelowY: number;
    WedgeHorizontalMargin: number;
    WedgeVerticalMargin: number;
    DistanceOffsetBetweenTwoHorizontallyCrossedWedges: number;
    WedgeMinLength: number;
    DistanceBetweenAdjacentDynamics: number;
    TempoChangeMeasureValidity: number;
    TempoContinousFactor: number;
    StaccatoScalingFactor: number;
    BetweenDotsDistance: number;
    OrnamentAccidentalScalingFactor: number;
    ChordSymbolTextHeight: number;
    ChordSymbolTextAlignment: TextAlignmentEnum;
    ChordSymbolRelativeXOffset: number;
    ChordSymbolXSpacing: number;
    ChordOverlapAllowedIntoNextMeasure: number;
    ChordSymbolYOffset: number;
    ChordSymbolLabelTexts: Dictionary<ChordSymbolEnum, string>;
    CustomChords: CustomChord[];
    RepetitionSymbolsYOffset: number;
    RehearsalMarkXOffset: number;
    RehearsalMarkXOffsetDefault: number;
    RehearsalMarkXOffsetSystemStartMeasure: number;
    RehearsalMarkYOffset: number;
    RehearsalMarkYOffsetDefault: number;
    RehearsalMarkFontSize: number;
    MeasureNumberLabelHeight: number;
    MeasureNumberLabelOffset: number;
    MeasureNumberLabelXOffset: number;
    /** Whether tuplets should display ratio (3:2 instead of 3 for triplet). Default false. */
    TupletsRatioed: boolean;
    /** Whether all tuplets should be bracketed (e.g. |--5--| instead of 5). Default false.
     * If false, only tuplets given as bracketed in XML (bracket="yes") will be bracketed.
     * (If not given in XML, bracketing is implementation-dependent according to standard)
     */
    TupletsBracketed: boolean;
    /** Whether all triplets should be bracketed. Overrides tupletsBracketed for triplets.
     * If false, only triplets given as bracketed in XML (bracket="yes") will be bracketed.
     * (Bracketing all triplets can be cluttering)
     */
    TripletsBracketed: boolean;
    TupletNumberLabelHeight: number;
    TupletNumberYOffset: number;
    LabelMarginBorderFactor: number;
    TupletVerticalLineLength: number;
    TupletNumbersInTabs: boolean;
    RepetitionEndingLabelHeight: number;
    RepetitionEndingLabelXOffset: number;
    RepetitionEndingLabelYOffset: number;
    RepetitionEndingLineYLowerOffset: number;
    RepetitionEndingLineYUpperOffset: number;
    VoltaOffset: number;
    /** Default alignment of lyrics.
     * Left alignments will extend text to the right of the bounding box,
     * which facilitates spacing by extending measure width.
     */
    LyricsAlignmentStandard: TextAlignmentEnum;
    LyricsHeight: number;
    LyricsYOffsetToStaffHeight: number;
    VerticalBetweenLyricsDistance: number;
    HorizontalBetweenLyricsDistance: number;
    BetweenSyllableMaximumDistance: number;
    BetweenSyllableMinimumDistance: number;
    LyricOverlapAllowedIntoNextMeasure: number;
    MinimumDistanceBetweenDashes: number;
    MaximumLyricsElongationFactor: number;
    SlurPlacementFromXML: boolean;
    BezierCurveStepSize: number;
    TPower3: number[];
    OneMinusTPower3: number[];
    FactorOne: number[];
    FactorTwo: number[];
    TieGhostObjectWidth: number;
    TieYPositionOffsetFactor: number;
    MinimumNeededXspaceForTieGhostObject: number;
    TieHeightMinimum: number;
    TieHeightMaximum: number;
    TieHeightInterpolationK: number;
    TieHeightInterpolationD: number;
    SlurNoteHeadYOffset: number;
    SlurStemXOffset: number;
    SlurSlopeMaxAngle: number;
    SlurTangentMinAngle: number;
    SlurTangentMaxAngle: number;
    SlurHeightFactor: number;
    SlurHeightFlattenLongSlursFactorByWidth: number;
    SlurHeightFlattenLongSlursFactorByAngle: number;
    SlurHeightFlattenLongSlursCutoffAngle: number;
    SlurHeightFlattenLongSlursCutoffWidth: number;
    SlursStartingAtSameStaffEntryYOffset: number;
    InstantaneousTempoTextHeight: number;
    ContinuousDynamicTextHeight: number;
    MoodTextHeight: number;
    UnknownTextHeight: number;
    ContinuousTempoTextHeight: number;
    VexFlowDefaultNotationFontScale: number;
    VexFlowDefaultTabFontScale: number;
    TremoloStrokeScale: number;
    TremoloYSpacingScale: number;
    StaffLineWidth: number;
    StaffLineColor: string;
    LedgerLineWidth: number;
    LedgerLineStrokeStyle: string;
    LedgerLineColorDefault: string;
    WedgeLineWidth: number;
    TupletLineWidth: number;
    LyricUnderscoreLineWidth: number;
    SystemThinLineWidth: number;
    SystemBoldLineWidth: number;
    SystemRepetitionEndingLineWidth: number;
    SystemDotWidth: number;
    MultipleRestMeasureDefaultWidth: number;
    DistanceBetweenVerticalSystemLines: number;
    DistanceBetweenDotAndLine: number;
    OctaveShiftLineWidth: number;
    OctaveShiftVerticalLineLength: number;
    GraceLineWidth: number;
    MinimumStaffLineDistance: number;
    MinSkyBottomDistBetweenStaves: number;
    MinimumCrossedBeamDifferenceMargin: number;
    VoiceSpacingMultiplierVexflow: number;
    VoiceSpacingAddendVexflow: number;
    PickupMeasureWidthMultiplier: number;
    DisplacedNoteMargin: number;
    MinNoteDistance: number;
    SubMeasureXSpacingThreshold: number;
    MeasureDynamicsMaxScalingFactor: number;
    WholeRestXShiftVexflow: number;
    MetronomeMarksDrawn: boolean;
    MetronomeMarkXShift: number;
    MetronomeMarkYShift: number;
    SoftmaxFactorVexFlow: number;
    MaxInstructionsConstValue: number;
    NoteDistances: number[];
    NoteDistancesScalingFactors: number[];
    DurationDistanceDict: {
        [_: number]: number;
    };
    DurationScalingDistanceDict: {
        [_: number]: number;
    };
    AlignRests: number;
    FillEmptyMeasuresWithWholeRest: FillEmptyMeasuresWithWholeRests | number;
    ArpeggiosGoAcrossVoices: boolean;
    RenderArpeggios: boolean;
    RenderSlurs: boolean;
    ColoringMode: ColoringMode;
    ColoringEnabled: boolean;
    ColorStemsLikeNoteheads: boolean;
    ColorFlags: boolean;
    ColorBeams: boolean;
    ColoringSetCurrent: Dictionary<NoteEnum | number, string>;
    DefaultColorNotehead: string;
    DefaultColorRest: string;
    DefaultColorStem: string;
    DefaultColorLabel: string;
    DefaultColorTitle: string;
    DefaultColorCursor: string;
    DefaultFontFamily: string;
    DefaultFontStyle: FontStyles;
    DefaultVexFlowNoteFont: string;
    MaxMeasureToDrawIndex: number;
    MinMeasureToDrawIndex: number;
    MaxPageToDrawNumber: number;
    MaxSystemToDrawNumber: number;
    /** Whether to render a label for the composer of the piece at the top of the sheet. */
    RenderComposer: boolean;
    RenderTitle: boolean;
    RenderSubtitle: boolean;
    RenderLyricist: boolean;
    RenderPartNames: boolean;
    RenderPartAbbreviations: boolean;
    RenderFingerings: boolean;
    RenderMeasureNumbers: boolean;
    RenderMeasureNumbersOnlyAtSystemStart: boolean;
    UseXMLMeasureNumbers: boolean;
    RenderLyrics: boolean;
    RenderChordSymbols: boolean;
    RenderMultipleRestMeasures: boolean;
    AutoGenerateMutipleRestMeasuresFromRestMeasures: boolean;
    RenderRehearsalMarks: boolean;
    RenderKeySignatures: boolean;
    RenderTimeSignatures: boolean;
    DynamicExpressionMaxDistance: number;
    DynamicExpressionSpacer: number;
    MpatMode: boolean;
    ArticulationPlacementFromXML: boolean;
    /** Position of fingering label in relation to corresponding note (left, right supported, above, below experimental) */
    FingeringPosition: PlacementEnum;
    FingeringInsideStafflines: boolean;
    FingeringLabelFontHeight: number;
    FingeringOffsetX: number;
    /** Whether to render string numbers in classical scores, i.e. not the string numbers in tabs, but e.g. for violin. */
    RenderStringNumbersClassical: boolean;
    /** This is not for tabs, but for classical scores, especially violin. */
    StringNumberOffsetY: number;
    NewSystemAtXMLNewSystemAttribute: boolean;
    NewPageAtXMLNewPageAttribute: boolean;
    PageFormat: PageFormat;
    PageBackgroundColor: string;
    RenderSingleHorizontalStaffline: boolean;
    RestoreCursorAfterRerender: boolean;
    StretchLastSystemLine: boolean;
    SpacingBetweenTextLines: number;
    NoteToGraphicalNoteMap: Dictionary<number, GraphicalNote>;
    NoteToGraphicalNoteMapObjectCount: number;
    static FixStafflineBoundingBox: boolean;
    constructor();
    loadDefaultValues(): void;
    addGraphicalNoteToNoteMap(note: Note, graphicalNote: GraphicalNote): void;
    GNote(note: Note): GraphicalNote;
    /** This should be done before a new sheet is loaded, not each re-render (otherwise the map would end empty). */
    clearMusicSheetObjects(): void;
    setChordSymbolLabelText(key: ChordSymbolEnum, value: string): void;
    resetChordSymbolLabelTexts(chordtexts: Dictionary<ChordSymbolEnum, string>): Dictionary<ChordSymbolEnum, string>;
    addChordName(altName: string, chordKindText: string, adds: string[], alts: string[], subs: string[]): void;
    renameChord(altName: string, newAltName: string): void;
    resetChordNames(): void;
    /**
     * This method maps NoteDurations to Distances and DistancesScalingFactors.
     */
    /**
     * Calculate Curve-independend factors, to be used later in the Slur- and TieCurvePoints calculation
     */
    private calculateCurveParametersArrays;
}
export declare class PageFormat {
    constructor(width: number, height: number, idString?: string);
    width: number;
    height: number;
    idString: string;
    get aspectRatio(): number;
    /** Undefined page format: use default page format. */
    get IsUndefined(): boolean;
    static get UndefinedPageFormat(): PageFormat;
    Equals(otherPageFormat: PageFormat): boolean;
}
