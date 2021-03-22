import { PlacementEnum } from "./Expressions/AbstractExpression";
import { ArticulationEnum } from "./VoiceEntry";
export declare class Articulation {
    placement: PlacementEnum;
    articulationEnum: ArticulationEnum;
    constructor(articulationEnum: ArticulationEnum, placement: PlacementEnum);
    Equals(otherArticulation: Articulation): boolean;
}
