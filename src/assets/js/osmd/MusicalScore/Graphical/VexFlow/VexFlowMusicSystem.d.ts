import { MusicSystem } from "../MusicSystem";
import { SystemLinesEnum } from "../SystemLinesEnum";
import { SystemLinePosition } from "../SystemLinePosition";
import { GraphicalMeasure } from "../GraphicalMeasure";
import { SystemLine } from "../SystemLine";
import { StaffLine } from "../StaffLine";
import { EngravingRules } from "../EngravingRules";
export declare class VexFlowMusicSystem extends MusicSystem {
    constructor(id: number, rules: EngravingRules);
    calculateBorders(rules: EngravingRules): void;
    /**
     * This method creates all the graphical lines and dots needed to render a system line (e.g. bold-thin-dots..).
     * @param xPosition
     * @param lineWidth
     * @param lineType
     * @param linePosition indicates if the line belongs to start or end of measure
     * @param musicSystem
     * @param topMeasure
     * @param bottomMeasure
     */
    protected createSystemLine(xPosition: number, lineWidth: number, lineType: SystemLinesEnum, linePosition: SystemLinePosition, musicSystem: MusicSystem, topMeasure: GraphicalMeasure, bottomMeasure?: GraphicalMeasure): SystemLine;
    /**
     * creates an instrument brace for the given dimension.
     * The height and positioning can be inferred from the given staff lines.
     * @param firstStaffLine the upper StaffLine (use a cast to get the VexFlowStaffLine) of the brace to create
     * @param lastStaffLine the lower StaffLine (use a cast to get the VexFlowStaffLine) of the brace to create
     */
    protected createInstrumentBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine): void;
    /**
     * creates an instrument group bracket for the given dimension.
     * There can be cascaded bracket (e.g. a group of 2 in a group of 4) -
     * The recursion depth informs about the current depth level (needed for positioning)
     * @param firstStaffLine the upper staff line of the bracket to create
     * @param lastStaffLine the lower staff line of the bracket to create
     * @param recursionDepth
     */
    protected createGroupBracket(firstStaffLine: StaffLine, lastStaffLine: StaffLine, recursionDepth: number): void;
}
