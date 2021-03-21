import { AbstractDisplayInteractionManager } from "./AbstractDisplayInteractionManager";
export declare class WebDisplayInteractionManager extends AbstractDisplayInteractionManager {
    protected isTouchDevice: boolean;
    protected osmdSheetMusicContainer: HTMLElement;
    protected fullOffsetLeft: number;
    protected fullOffsetTop: number;
    constructor(osmdContainer: HTMLElement);
    protected initialize(): void;
    protected dispose(): void;
    private isTouch;
    protected get downEventName(): string;
    protected get moveEventName(): string;
    private listenForInteractions;
    private readonly DOUBLE_CLICK_WINDOW;
    private clickTimeout;
    private lastClick;
    private downEventListener;
    private moveEventListener;
    private touchEndEventListener;
    private resizeEventListener;
    private getOffsetCoordinates;
}
