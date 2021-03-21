export declare type PlayPauseButtonState = "playing" | "paused";
export declare class PlayPauseButton {
    private el;
    private listeners;
    state: PlayPauseButtonState;
    constructor(element: HTMLButtonElement);
    private toggleState;
    listen(listener: (state?: PlayPauseButtonState) => any): void;
}
