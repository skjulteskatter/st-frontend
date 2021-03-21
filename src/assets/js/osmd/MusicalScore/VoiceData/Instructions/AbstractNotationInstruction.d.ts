import { SourceStaffEntry } from "../SourceStaffEntry";
export declare abstract class AbstractNotationInstruction {
    constructor(parent: SourceStaffEntry);
    protected parent: SourceStaffEntry;
    /** States whether the object should be displayed. False if xmlNode.attribute("print-object").value = "no". */
    private printObject;
    get Parent(): SourceStaffEntry;
    set Parent(value: SourceStaffEntry);
    get PrintObject(): boolean;
    set PrintObject(value: boolean);
}
