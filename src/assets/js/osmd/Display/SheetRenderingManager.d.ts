import { IZoomView } from "../Common/Interfaces/IZoomView";
import { MusicSheetDrawer, GraphicalMusicSheet, BoundingBox, DrawingParameters, MusicSystem } from "../MusicalScore/Graphical";
import { ScreenViewingRegion } from "./ScreenViewingRegion";
import { PointF2D, Fraction } from "../Common/DataObjects";
import { AbstractZoomView } from "./AbstractZoomView";
import { InteractionType } from "../Common/Enums/InteractionType";
import { AbstractDisplayInteractionManager } from "./AbstractDisplayInteractionManager";
import { IUserDisplayInteractionListener } from "../Common/Interfaces/IUserDisplayInteractionListener";
import { PlaybackManager } from "../Playback";
export declare class SheetRenderingManager extends AbstractZoomView implements IZoomView {
    protected musicSheetDrawer: MusicSheetDrawer;
    protected graphicalMusicSheet: GraphicalMusicSheet;
    protected mainViewingRegion: ScreenViewingRegion;
    protected tryAgainToRenderCount: number;
    private yOffsetMouseDown;
    private unlockCursorDistancePixel;
    private relativeTopPosition;
    protected internalPreviewImageScale: number;
    protected listeners: IUserDisplayInteractionListener[];
    PlaybackManager: PlaybackManager;
    constructor(displayInteractionManager: AbstractDisplayInteractionManager, playbackManager?: PlaybackManager);
    addListener(listener: IUserDisplayInteractionListener): void;
    SingleTouchDisabled: boolean;
    DoubleTouchDisabled: boolean;
    LockDisplayToCursor: boolean;
    ZoomActive: boolean;
    protected convertToUnitsReady(): boolean;
    protected unitPosTouched(PosInUnits: PointF2D, relPosX: number, relPosY: number): void;
    protected unitPosDoubleTouched(PosInUnits: PointF2D, relPosX: number, relPosY: number): void;
    protected unitPosTouchDown(PosInUnits: PointF2D, relPosX: number, relPosY: number): void;
    protected unitPosTouchUp(PosInUnits: PointF2D, relPosX: number, relPosY: number): void;
    protected unitPosMove(PosInUnits: PointF2D, relPosX: number, relPosY: number): void;
    get MainViewingRegion(): ScreenViewingRegion;
    TopBarHeightInPixel: number;
    BottomBarHeightInPixel: number;
    setMusicSheet(musicSheet: GraphicalMusicSheet): void;
    viewportXChanged(offsetX: number, rangeX: number): void;
    /**
     * Sets the vertical position and viewing height of the displayed area on the music score.
     */
    viewportYChanged(offsetY: number, rangeY: number): void;
    displaySizeChanged(width: number, height: number): void;
    calcDisplayYPosition(system: MusicSystem): number;
    /**
     * The display scroll y-position to show the given system completely on the bottom of the screen
     */
    yPositionForLastSystem(lastSystem: MusicSystem): number;
    scorePositionChanged(upperCursorPoint: PointF2D, enrolledTimeStamp: Fraction, sheetTimeStamp: Fraction, system: MusicSystem, resetOccurred: boolean, smoothAnimation: boolean): void;
    setXPosition(positionXInUnits: number, animated: boolean): void;
    setYPosition(positionYInUnits: number, animated: boolean): void;
    clearBackbuffers(): void;
    get DrawingParameters(): DrawingParameters;
    topBarHeightInUnits(): number;
    bottomBarHeightInUnits(): number;
    heightWithoutTopBottomBarsInUnits(): number;
    activePositionToBottomBarHeight(): number;
    getClickPosition(relativePositionX: number, relativePositionY: number): PointF2D;
    graphicalObjectIsVisible(boundingBox: BoundingBox): boolean;
    /**
     * sets the size of the maximal musicpage seen including the extensions on top resp. bottom
     * !Caution!: settings/offsets have been changed for ScrollIndicator.. won't work anymore if changed again
     */
    adaptDisplayLimitsToSheet(): void;
    protected horizontalViewportChanged(offsetX: number, rangeX: number): void;
    protected verticalViewportChanged(offsetY: number, rangeY: number): void;
    private unlockFromCursorIfNecessary;
    protected getPositionInUnits(relativePositionX: number, relativePositionY: number): PointF2D;
    protected handleUserDisplayInteraction(relativePositionOnDisplay: PointF2D, positionOnMusicSheet: PointF2D, type: InteractionType): void;
    protected setStartPosition(newStartPosition: Fraction): void;
}
