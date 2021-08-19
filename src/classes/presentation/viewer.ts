import { PresentationBase } from "./base";

export class PresentationViewer extends PresentationBase {
    public init() {
        this.initialize("viewer");
    }

    public get Verses() {
        return Object.entries(this.Lyrics?.verses ?? {})
            .filter(i => this.currentVerses.includes(i[0]))
            .map(i => i[1]);
    }
}

export const viewer = new PresentationViewer();
