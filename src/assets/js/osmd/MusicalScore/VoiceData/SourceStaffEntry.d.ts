import { Fraction } from "../../Common/DataObjects/Fraction";
import { VerticalSourceStaffEntryContainer } from "./VerticalSourceStaffEntryContainer";
import { Staff } from "./Staff";
import { AbstractNotationInstruction } from "./Instructions/AbstractNotationInstruction";
import { VoiceEntry } from "./VoiceEntry";
import { Note } from "./Note";
import { StaffEntryLink } from "./StaffEntryLink";
import { ChordSymbolContainer } from "./ChordSymbolContainer";
/**
 * A [[SourceStaffEntry]] is a container spanning all the [[VoiceEntry]]s at one timestamp for one [[StaffLine]].
 */
export declare class SourceStaffEntry {
    constructor(verticalContainerParent: VerticalSourceStaffEntryContainer, parentStaff: Staff);
    private parentStaff;
    private verticalContainerParent;
    private voiceEntries;
    private staffEntryLink;
    private instructions;
    private chordSymbolContainers;
    get ParentStaff(): Staff;
    get VerticalContainerParent(): VerticalSourceStaffEntryContainer;
    get Timestamp(): Fraction;
    get AbsoluteTimestamp(): Fraction;
    get VoiceEntries(): VoiceEntry[];
    set VoiceEntries(value: VoiceEntry[]);
    get Link(): StaffEntryLink;
    set Link(value: StaffEntryLink);
    get Instructions(): AbstractNotationInstruction[];
    set Instructions(value: AbstractNotationInstruction[]);
    get ChordContainers(): ChordSymbolContainer[];
    set ChordContainers(value: ChordSymbolContainer[]);
    removeAllInstructionsOfTypeClefInstruction(): number;
    /**
     * Similar to RemoveAllInstructionsOfType but faster,
     * because it stops searching when the first instruction of the given type is found.
     * @returns {boolean}
     */
    removeFirstInstructionOfTypeClefInstruction(): boolean;
    removeAllInstructionsOfTypeKeyInstruction(): number;
    /**
     * Similar to RemoveAllInstructionsOfType but faster,
     * because it stops searching when the first instruction of the given type is found.
     * @returns {boolean}
     */
    removeFirstInstructionOfTypeKeyInstruction(): boolean;
    removeAllInstructionsOfTypeRhythmInstruction(): number;
    removeFirstInstructionOfTypeRhythmInstruction(): boolean;
    /**
     * Calculate the [[SourceStaffEntry]]'s minimum NoteLength.
     * @returns {Fraction}
     */
    calculateMinNoteLength(): Fraction;
    calculateMaxNoteLength(): Fraction;
    hasNotes(): boolean;
    hasTie(): boolean;
    findLinkedNotes(linkedNotes: Note[]): void;
    get hasOnlyRests(): boolean;
}
