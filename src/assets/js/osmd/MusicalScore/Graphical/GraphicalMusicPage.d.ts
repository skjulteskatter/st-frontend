import { GraphicalObject } from "./GraphicalObject";
import { GraphicalLabel } from "./GraphicalLabel";
import { MusicSystem } from "./MusicSystem";
import { EngravingRules } from "./EngravingRules";
import { PointF2D } from "../../Common/DataObjects/PointF2D";
import { GraphicalMusicSheet } from "./GraphicalMusicSheet";
export declare class GraphicalMusicPage extends GraphicalObject {
    private musicSystems;
    private labels;
    private parent;
    private pageNumber;
    constructor(parent: GraphicalMusicSheet);
    get MusicSystems(): MusicSystem[];
    set MusicSystems(value: MusicSystem[]);
    get Labels(): GraphicalLabel[];
    set Labels(value: GraphicalLabel[]);
    get Parent(): GraphicalMusicSheet;
    set Parent(value: GraphicalMusicSheet);
    get PageNumber(): number;
    set PageNumber(value: number);
    /**
     * This method calculates the absolute Position of each GraphicalMusicPage according to a given placement
     * @param pageIndex
     * @param rules
     * @returns {PointF2D}
     */
    setMusicPageAbsolutePosition(pageIndex: number, rules: EngravingRules): PointF2D;
}
export declare enum PagePlacementEnum {
    Down = 0,
    Right = 1,
    RightDown = 2
}
