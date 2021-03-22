import { Note } from "./Note";
import { Fraction } from "../../Common/DataObjects/Fraction";
import { Pitch } from "../../Common/DataObjects/Pitch";
import { TieTypes } from "../../Common/Enums/";
/**
 * A [[Tie]] connects two notes of the same pitch and name, indicating that they have to be played as a single note.
 */
export declare class Tie {
    constructor(note: Note, type: TieTypes);
    private notes;
    private type;
    get Notes(): Note[];
    get Type(): TieTypes;
    get StartNote(): Note;
    get Duration(): Fraction;
    get Pitch(): Pitch;
    AddNote(note: Note): void;
}
