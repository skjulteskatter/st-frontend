import { Staff } from "../../VoiceData/Staff";
import { SourceMeasure } from "../../VoiceData/SourceMeasure";
import { VexFlowMeasure } from "./VexFlowMeasure";
import { StaffLine } from "../StaffLine";
export declare class VexFlowTabMeasure extends VexFlowMeasure {
    constructor(staff: Staff, sourceMeasure?: SourceMeasure, staffLine?: StaffLine);
    /**
     * Reset all the geometric values and parameters of this measure and put it in an initialized state.
     * This is needed to evaluate a measure a second time by system builder.
     */
    resetLayout(): void;
    graphicalMeasureCreatedCalculations(): void;
}
