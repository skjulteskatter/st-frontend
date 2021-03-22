import { Voice } from "./Voice";
import { Instrument } from "../Instrument";
export declare class LinkedVoice extends Voice {
    constructor(parent: Instrument, voiceId: number, master: Voice);
    private master;
    get Master(): Voice;
}
