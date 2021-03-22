import { Fraction } from "./Fraction";
export declare class PlaybackSettings {
    private beatsPerMinute;
    private beatLengthInMilliseconds;
    private beatRealValue;
    rhythm: Fraction;
    /** The denominator of the fraction of the rhythm is 1 beat long
     * --> By knowing the rhythm and the beatsPerMinute the length of notes can be calculated.
     */
    constructor(rhythm?: Fraction, beatsPerMinute?: number);
    static createFrom(from: PlaybackSettings): PlaybackSettings;
    get BeatsPerMinute(): number;
    set BeatsPerMinute(value: number);
    get Rhythm(): Fraction;
    set Rhythm(value: Fraction);
    get BeatRealValue(): number;
    get BeatLengthInMilliseconds(): number;
    getDurationInMilliseconds(duration: number | Fraction): number;
    getDurationAsNoteDuration(milliseconds: number, fractionPrecision?: number): Fraction;
}
