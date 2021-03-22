import { ITextMeasurer } from "../../Interfaces/ITextMeasurer";
import { Fonts } from "../../../Common/Enums/Fonts";
import { FontStyles } from "../../../Common/Enums/FontStyles";
import { EngravingRules } from "../EngravingRules";
/**
 * Created by Matthias on 21.06.2016.
 */
export declare class VexFlowTextMeasurer implements ITextMeasurer {
    constructor(rules: EngravingRules);
    private context;
    fontSize: number;
    fontSizeStandard: number;
    private rules;
    /**
     *
     * @param text
     * @param font
     * @param style
     * @returns {number}
     */
    computeTextWidthToHeightRatio(text: string, font: Fonts, style: FontStyles, fontFamily?: string, fontSize?: number): number;
    setFontSize(fontSize?: number): number;
}
