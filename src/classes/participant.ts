import { ApiParticipant } from "dmb-api";
import { Contributor } from "./contributor";

export class Participant implements ApiParticipant {
    public contributorId: string;
    public contributor?: Contributor;
    public type;

    constructor(p: ApiParticipant) {
        this.contributorId = p.contributorId;
        this.contributor = p.contributor ? new Contributor(p.contributor) : undefined;
        this.type = p.type;
    }
}
