import { ApiParticipant } from "dmb-api";

export class Participant implements ApiParticipant {
    public contributorId: string;
    public type;

    constructor(p: ApiParticipant) {
        this.contributorId = p.contributorId;
        this.type = p.type;
    }
}
