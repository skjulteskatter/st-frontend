import Vex from "vexflow";
import { FontStyles } from "../../../Common/Enums/FontStyles";
import { Fonts } from "../../../Common/Enums/Fonts";
import { RectangleF2D } from "../../../Common/DataObjects/RectangleF2D";
import { PointF2D } from "../../../Common/DataObjects/PointF2D";
import { BackendType } from "../../../OpenSheetMusicDisplay/OSMDOptions";
import { GraphicalMusicPage } from "../GraphicalMusicPage";
import { EngravingRules } from "../EngravingRules";
export declare class VexFlowBackends {
    static CANVAS: 0;
    static RAPHAEL: 1;
    static SVG: 2;
    static VML: 3;
}
export declare abstract class VexFlowBackend {
    /** The GraphicalMusicPage the backend is drawing from. Each backend only renders one GraphicalMusicPage, to which the coordinates are relative. */
    graphicalMusicPage: GraphicalMusicPage;
    protected rules: EngravingRules;
    width: number;
    height: number;
    abstract initialize(container: HTMLElement, zoom: number): void;
    getInnerElement(): HTMLElement;
    getCanvas(): HTMLElement;
    abstract getCanvasSize(): number;
    getRenderElement(): HTMLElement;
    getRenderer(): Vex.Flow.Renderer;
    removeAllChildrenFromContainer(container: HTMLElement): void;
    removeFromContainer(container: HTMLElement): void;
    abstract getContext(): Vex.IRenderContext;
    abstract scale(k: number): void;
    resize(width: number, height: number): void;
    abstract clear(): void;
    abstract translate(x: number, y: number): void;
    abstract renderText(fontHeight: number, fontStyle: FontStyles, font: Fonts, text: string, heightInPixel: number, screenPosition: PointF2D, color?: string, fontFamily?: string): Node;
    /**
     * Renders a rectangle with the given style to the screen.
     * It is given in screen coordinates.
     * @param rectangle the rect in screen coordinates
     * @param layer is the current rendering layer. There are many layers on top of each other to which can be rendered. Not needed for now.
     * @param styleId the style id
     * @param alpha alpha value between 0 and 1
     */
    abstract renderRectangle(rectangle: RectangleF2D, styleId: number, colorHex: string, alpha: number): Node;
    abstract renderLine(start: PointF2D, stop: PointF2D, color: string, lineWidth: number): Node;
    abstract renderCurve(points: PointF2D[]): void;
    abstract getVexflowBackendType(): Vex.Flow.Renderer.Backends;
    /** The general type of backend: Canvas or SVG.
     * This is not used for now (only VexflowBackendType used), but it may be useful when we don't want to use a Vexflow class.
     */
    abstract getOSMDBackendType(): BackendType;
    protected renderer: Vex.Flow.Renderer;
    protected inner: HTMLElement;
    protected canvas: HTMLElement;
}
