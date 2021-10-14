import { ApiParticipant } from "dmb-api";
import { Contributor } from "./contributor";

export default class Participant implements ApiParticipant {
    public contributorId;
    public type;
    public contributor;

    constructor(p: ApiParticipant) {
        this.contributorId = p.contributorId;
        this.contributor = p.contributor ? new Contributor(p.contributor) : undefined;
        this.type = p.type;
    }
}
