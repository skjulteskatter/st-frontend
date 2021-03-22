import { ITimingSource } from "../../Common/Interfaces/ITimingSource";
import { Fraction } from "../../Common/DataObjects";
import { PlaybackSettings } from "../../Common/DataObjects/PlaybackSettings";
export declare class AbstractTimingSource implements ITimingSource {
    Settings: PlaybackSettings;
    protected anchorTimestamp: Fraction;
    setBpm(bpm: number): void;
    setTimeAndBpm(timestamp: Fraction, bpm: number): void;
    getCurrentTimestamp(): Fraction;
    getWaitingTimeForTimestampInMs(timestamp: Fraction): number;
    getDurationInMs(duration: Fraction): number;
    getDuration(milliseconds: number): Fraction;
    getCurrentTimeInMs(): number;
    getTimestampForTimeInMs(timesInMs: number): Fraction;
    start(): void;
    pause(): void;
    reset(): void;
    getCurrentAudioDelayRevisedTimestamp(): Fraction;
}
