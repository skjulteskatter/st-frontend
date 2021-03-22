import { GraphicalObject } from "./GraphicalObject";
export declare class GraphicalLayer<T extends GraphicalObject> {
    readonly UUID: string;
    Name: string;
    MemberObjects: T[];
    constructor(layerName?: string, UUID?: string);
    Equals(otherLayer: GraphicalLayer<T>): boolean;
}
