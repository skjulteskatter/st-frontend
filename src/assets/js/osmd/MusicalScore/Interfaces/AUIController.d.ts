import { PointF2D } from "../../Common/DataObjects";
export declare abstract class AUIController<T> {
    protected parentElement: HTMLElement;
    protected insertLocation: InsertPosition;
    protected isTouchDevice: boolean;
    protected eventListeners: T[];
    protected abstract initialize(): void;
    abstract show(location?: PointF2D): void;
    abstract hideAndClear(): void;
    constructor(parentElement?: HTMLElement, isTouchDevice?: boolean, where?: InsertPosition);
    addListener(listener: T): void;
    protected generateHtmlTemplate(rawHtml: string, data?: Object): string;
    protected generateAndInsertHtmlTemplate(rawHtml: string, data?: Object, where?: InsertPosition, parent?: HTMLElement): void;
    protected get downEventName(): string;
    protected get upEventName(): string;
    protected get moveEventName(): string;
}
