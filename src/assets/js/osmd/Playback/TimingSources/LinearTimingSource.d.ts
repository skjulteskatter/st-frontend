import { AbstractTimingSource } from "./AbstractTimingSource";
import { Fraction } from "../../Common/DataObjects";
export declare class LinearTimingSource extends AbstractTimingSource {
    private audioContext;
    private audioInputDelay;
    private lastResetTime;
    constructor();
    getCurrentTimeInMs(): number;
    getCurrentAudioDelayRevisedTimestamp(): Fraction;
    getTimestampForTimeInMs(timesInMs: number): Fraction;
    start(): Promise<void>;
    pause(): Promise<void>;
    reset(): void;
}
