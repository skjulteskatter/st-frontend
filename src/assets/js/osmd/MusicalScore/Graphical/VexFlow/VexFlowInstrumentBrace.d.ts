import { VexFlowInstrumentBracket } from "./VexFlowInstrumentBracket";
import { VexFlowStaffLine } from "./VexFlowStaffLine";
/**
 * Class that defines a instrument bracket at the beginning of a line.
 */
export declare class VexFlowInstrumentBrace extends VexFlowInstrumentBracket {
    constructor(firstVexFlowStaffLine: VexFlowStaffLine, lastVexFlowStaffLine: VexFlowStaffLine, depth?: number);
}
