import { IParticipant } from "songtreasures-api";
import { Contributor } from ".";

export default class Participant implements IParticipant {
    public contributorId;
    public type;
    public contributor;

    constructor(p: IParticipant) {
        this.contributorId = p.contributorId;
        this.contributor = p.contributor ? new Contributor(p.contributor) : undefined;
        this.type = p.type;
    }
}
