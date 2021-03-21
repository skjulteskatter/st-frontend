import { PlacementEnum } from "../Expressions/AbstractExpression";
import { Note } from "../Note";
export declare enum TechnicalInstructionType {
    Fingering = 0,
    String = 1
}
export declare class TechnicalInstruction {
    type: TechnicalInstructionType;
    value: string;
    placement: PlacementEnum;
    sourceNote: Note;
}
