import { ApiParticipant } from "dmb-api";
import { Contributor } from "./contributor";

export class Participant implements ApiParticipant {
    public contributorId: string;
    public contributor: Contributor;
    public type: string;

    constructor(p: ApiParticipant) {
        this.contributorId = p.contributorId;
        this.contributor = new Contributor(p.contributor);
        this.type = p.type;
    }
}