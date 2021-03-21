import { Fraction } from "../DataObjects";
import { PlaybackSettings } from "../DataObjects/PlaybackSettings";
export interface ITimingSource {
    Settings: PlaybackSettings;
    setBpm(bpm: number): void;
    setTimeAndBpm(timestamp: Fraction, bpm: number): void;
    /** @returns the time in milliseconds when the given timestamp will be reached. */
    getWaitingTimeForTimestampInMs(timestamp: Fraction): number;
    getDurationInMs(duration: Fraction): number;
    getCurrentTimeInMs(): number;
    getCurrentTimestamp(): Fraction;
    /** @returns Returns the current audio timestamp as fraction, but revised by the audio delay of the system (e.g. a constant value is subtracted). */
    getCurrentAudioDelayRevisedTimestamp(): Fraction;
    getTimestampForTimeInMs(timesInMs: number): Fraction;
    getDuration(milliseconds: number): Fraction;
    start(): void;
    pause(): void;
    reset(): void;
}
