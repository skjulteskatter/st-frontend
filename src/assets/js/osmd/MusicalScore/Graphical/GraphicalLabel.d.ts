import { TextAlignmentEnum } from "../../Common/Enums/TextAlignment";
import { Label } from "../Label";
import { BoundingBox } from "./BoundingBox";
import { Clickable } from "./Clickable";
import { EngravingRules } from "./EngravingRules";
/**
 * The graphical counterpart of a Label
 */
export declare class GraphicalLabel extends Clickable {
    private label;
    private rules;
    TextLines: {
        text: string;
        xOffset: number;
        width: number;
    }[];
    /**
     * Creates a new GraphicalLabel from a Label
     * @param label  label object containing text
     * @param textHeight Height of text
     * @param alignment Alignement like left, right, top, ...
     * @param parent Parent Bounding Box where the label is attached to
     */
    constructor(label: Label, textHeight: number, alignment: TextAlignmentEnum, rules: EngravingRules, parent?: BoundingBox);
    get Label(): Label;
    toString(): string;
    /**
     * Calculate GraphicalLabel's Borders according to its Alignment
     * Create also the text-lines and their offsets here
     */
    setLabelPositionAndShapeBorders(): void;
}
