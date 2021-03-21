import { StaffLine } from "../StaffLine";
import { MusicSystem } from "../MusicSystem";
import { Staff } from "../../VoiceData/Staff";
import { VexFlowSlur } from "./VexFlowSlur";
import { AlignmentManager } from "./AlignmentManager";
export declare class VexFlowStaffLine extends StaffLine {
    constructor(parentSystem: MusicSystem, parentStaff: Staff);
    protected slursInVFStaffLine: VexFlowSlur[];
    protected alignmentManager: AlignmentManager;
    get SlursInVFStaffLine(): VexFlowSlur[];
    addVFSlurToVFStaffline(vfSlur: VexFlowSlur): void;
    get AlignmentManager(): AlignmentManager;
}
