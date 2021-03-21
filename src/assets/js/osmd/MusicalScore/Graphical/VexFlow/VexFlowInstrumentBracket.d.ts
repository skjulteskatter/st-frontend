import Vex from "vexflow";
import { GraphicalObject } from "../GraphicalObject";
import { VexFlowStaffLine } from "./VexFlowStaffLine";
/**
 * Class that defines a instrument bracket at the beginning of a line.
 */
export declare class VexFlowInstrumentBracket extends GraphicalObject {
    protected vexflowConnector: Vex.Flow.StaveConnector;
    constructor(firstVexFlowStaffLine: VexFlowStaffLine, lastVexFlowStaffLine: VexFlowStaffLine, depth?: number);
    /**
     * Render the bracket using the given backend
     * @param ctx Render Vexflow context
     */
    draw(ctx: Vex.IRenderContext): void;
    /**
     * Adds a connector between two staves
     *
     * @param {Stave} stave1: First stave
     * @param {Stave} stave2: Second stave
     * @param {Flow.StaveConnector.type} type: Type of connector
     */
    private addConnector;
}
