export interface IAudioMetronomePlayer {
    /**
     * Play the sound for the first beat within the measure
     * @param volume relative volume ranging from 0.0 - 1.0
     */
    playFirstBeatSample(volume: number): void;
    /**
     * Play the sound for all but the first beat within the measure
     * @param volume relative volume ranging from 0.0 - 1.0
     */
    playBeatSample(volume: number): void;
}
