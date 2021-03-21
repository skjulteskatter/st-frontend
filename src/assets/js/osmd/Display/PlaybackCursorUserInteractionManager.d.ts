import { PointF2D } from "../Common/DataObjects";
import { InteractionType } from "../Common/Enums/InteractionType";
import { IUserDisplayInteractionListener } from "../Common/Interfaces/IUserDisplayInteractionListener";
import { GraphicalMusicSheet } from "../MusicalScore";
import { Cursor } from "../OpenSheetMusicDisplay/Cursor";
export declare class PlaybackCursorUserInteractionManager implements IUserDisplayInteractionListener {
    private graphic;
    constructor(graphic: GraphicalMusicSheet, cursor: Cursor);
    userDisplayInteraction(relativePosition: PointF2D, positionInSheetUnits: PointF2D, type: InteractionType): void;
}
