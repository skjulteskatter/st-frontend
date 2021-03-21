import { PointF2D } from "../../Common/DataObjects/PointF2D";
import { SizeF2D } from "../../Common/DataObjects/SizeF2D";
import { RectangleF2D } from "../../Common/DataObjects/RectangleF2D";
import { Clickable } from "./Clickable";
import { GraphicalObject } from "./GraphicalObject";
/**
 * A bounding box delimits an area on the 2D plane.
 * @param dataObject Graphical object where the bounding box will be attached
 * @param parent Parent bounding box of an object in a higher hierarchy position
 * @param connectChildToParent Create a child to parent relationship too. Will be true by default
 */
export declare class BoundingBox {
    protected isSymbol: boolean;
    protected relativePositionHasBeenSet: boolean;
    protected xBordersHaveBeenSet: boolean;
    protected yBordersHaveBeenSet: boolean;
    protected absolutePosition: PointF2D;
    protected relativePosition: PointF2D;
    protected size: SizeF2D;
    protected marginSize: SizeF2D;
    protected upperLeftCorner: PointF2D;
    protected upperLeftMarginCorner: PointF2D;
    protected borderLeft: number;
    protected borderRight: number;
    protected borderTop: number;
    protected borderBottom: number;
    protected borderMarginLeft: number;
    protected borderMarginRight: number;
    protected borderMarginTop: number;
    protected borderMarginBottom: number;
    protected boundingRectangle: RectangleF2D;
    protected boundingMarginRectangle: RectangleF2D;
    protected childElements: BoundingBox[];
    protected parent: BoundingBox;
    protected dataObject: Object;
    /**
     * Create a bounding box
     * @param dataObject Graphical object where the bounding box will be attached
     * @param parent Parent bounding box of an object in a higher hierarchy position
     * @param isSymbol Defines the bounding box to be symbol thus not calculating its boundaries by itself. NOTE: Borders need to be set!
     */
    constructor(dataObject?: Object, parent?: BoundingBox, isSymbol?: boolean);
    get RelativePositionHasBeenSet(): boolean;
    get XBordersHaveBeenSet(): boolean;
    set XBordersHaveBeenSet(value: boolean);
    get YBordersHaveBeenSet(): boolean;
    set YBordersHaveBeenSet(value: boolean);
    get AbsolutePosition(): PointF2D;
    set AbsolutePosition(value: PointF2D);
    get RelativePosition(): PointF2D;
    set RelativePosition(value: PointF2D);
    get Size(): SizeF2D;
    set Size(value: SizeF2D);
    get MarginSize(): SizeF2D;
    get UpperLeftCorner(): PointF2D;
    get UpperLeftMarginCorner(): PointF2D;
    get BorderLeft(): number;
    set BorderLeft(value: number);
    get BorderRight(): number;
    set BorderRight(value: number);
    get BorderTop(): number;
    set BorderTop(value: number);
    get BorderBottom(): number;
    set BorderBottom(value: number);
    get BorderMarginLeft(): number;
    set BorderMarginLeft(value: number);
    get BorderMarginRight(): number;
    set BorderMarginRight(value: number);
    get BorderMarginTop(): number;
    set BorderMarginTop(value: number);
    get BorderMarginBottom(): number;
    set BorderMarginBottom(value: number);
    get BoundingRectangle(): RectangleF2D;
    get BoundingMarginRectangle(): RectangleF2D;
    get ChildElements(): BoundingBox[];
    set ChildElements(value: BoundingBox[]);
    get Parent(): BoundingBox;
    set Parent(value: BoundingBox);
    get DataObject(): Object;
    /**
     * Get the center of a bounding box
     * @param boundingBox Bounding box to check
     */
    get Center(): PointF2D;
    setAbsolutePositionFromParent(): void;
    /**
     * Calculate the the absolute position by adding up all relative positions of all parents (including the own rel. pos.)
     */
    calculateAbsolutePosition(): void;
    /**
     * This method calculates the Absolute Positions recursively
     */
    calculateAbsolutePositionsRecursiveWithoutTopelement(): void;
    /**
     * This method calculates the Absolute Positions recursively
     * from the root element down to the leaf elements
     * @param x
     * @param y
     */
    calculateAbsolutePositionsRecursive(x: number, y: number): void;
    /**
     * calculates the absolute positions of all children of this boundingBox
     */
    calculateAbsolutePositionsOfChildren(): void;
    /**
     * This method calculates the BoundingBoxes
     */
    calculateBoundingBox(): void;
    calculateTopBottomBorders(): void;
    /**
     * This method computes the first non-overlapping position in the placementPsi Element for the current (this) positionAndShapeInfo
     * @param placementPsi
     * @param direction
     * @param position
     */
    computeNonOverlappingPositionWithMargin(placementPsi: BoundingBox, direction: ColDirEnum, position: PointF2D): void;
    /**
     * This method detects a collision (without margins)
     * @param psi
     * @returns {boolean}
     */
    collisionDetection(psi: BoundingBox): boolean;
    /**
     * This method checks if the given Psi's Margins lie inside the current Psi's Margins.
     * @param psi
     * @returns {boolean}
     */
    liesInsideBorders(psi: BoundingBox): boolean;
    pointLiesInsideBorders(position: PointF2D): boolean;
    /**
     * This method detects a collision (margin-wide)
     * @param psi
     * @returns {boolean}
     */
    marginCollisionDetection(psi: BoundingBox): boolean;
    /**
     * This method checks if the given Psi's Margins lie inside the current Psi's Margins
     * @param psi
     * @returns {boolean}
     */
    liesInsideMargins(psi: BoundingBox): boolean;
    pointLiesInsideMargins(position: PointF2D): boolean;
    /**
     * This method computes the first non-overlapping position in the placementPsi Element for the current (this) positionAndShapeInfo
     * @param placementPsi
     * @param direction
     * @param position
     */
    computeNonOverlappingPosition(placementPsi: BoundingBox, direction: ColDirEnum, position: PointF2D): void;
    getClickedObjectOfType<T>(clickPosition: PointF2D): T;
    getClickedClickable(clickPosition: PointF2D): Clickable;
    getObjectsInRegion<T extends GraphicalObject>(region: BoundingBox, liesInside?: boolean, className?: string): T[];
    protected calculateRectangle(): void;
    protected calculateMarginRectangle(): void;
    /**
     * This method calculates the margin border along the given direction so that no collision takes place along this direction
     * @param toBePlaced
     * @param direction
     */
    private calculateMarginPositionAlongDirection;
    /**
     * This method calculates the border along the given direction so that no collision takes place along this direction
     * @param toBePlaced
     * @param direction
     */
    private calculatePositionAlongDirection;
}
export declare enum ColDirEnum {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3
}
