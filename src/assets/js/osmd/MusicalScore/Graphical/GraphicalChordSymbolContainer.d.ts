import { GraphicalLabel } from "./GraphicalLabel";
import { ChordSymbolContainer } from "../VoiceData/ChordSymbolContainer";
import { BoundingBox } from "./BoundingBox";
import { GraphicalObject } from "./GraphicalObject";
import { EngravingRules } from "./EngravingRules";
import { KeyInstruction } from "../VoiceData/Instructions/KeyInstruction";
export declare class GraphicalChordSymbolContainer extends GraphicalObject {
    private chordSymbolContainer;
    private graphicalLabel;
    private rules;
    constructor(chordSymbolContainer: ChordSymbolContainer, parent: BoundingBox, textHeight: number, keyInstruction: KeyInstruction, transposeHalftones: number, rules: EngravingRules);
    get GetChordSymbolContainer(): ChordSymbolContainer;
    get GraphicalLabel(): GraphicalLabel;
    private calculateLabel;
}
