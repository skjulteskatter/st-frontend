import { GraphicalMeasure } from "./GraphicalMeasure";
import { StaffLine } from "./StaffLine";
import { MusicSystem } from "./MusicSystem";
import { SystemLinePosition } from "./SystemLinePosition";
import { SystemLinesEnum } from "./SystemLinesEnum";
import { GraphicalObject } from "./GraphicalObject";
import { EngravingRules } from "./EngravingRules";
export declare class SystemLine extends GraphicalObject {
    constructor(lineType: SystemLinesEnum, linePosition: SystemLinePosition, musicSystem: MusicSystem, topMeasure: GraphicalMeasure, bottomMeasure?: GraphicalMeasure);
    lineType: SystemLinesEnum;
    linePosition: SystemLinePosition;
    parentMusicSystem: MusicSystem;
    parentTopStaffLine: StaffLine;
    topMeasure: GraphicalMeasure;
    bottomMeasure: GraphicalMeasure;
    /**
     * Return the width of the SystemLinesContainer for the given SystemLineType.
     * @param rules
     * @param systemLineType
     * @returns {number}
     */
    static getObjectWidthForLineType(rules: EngravingRules, systemLineType: SystemLinesEnum): number;
}
