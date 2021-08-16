import { PresentationBase } from "./base";

class PresentationViewer extends PresentationBase {
    public init() {
        this.initialize("viewer");
    }

    public get currentVerses() {
        const verses: string[] = [];
        if (this.Settings) {
            const index = this.Settings.currentIndex;
            const size = this.Settings.size;

            const verse = this.Settings.availableVerses[index];
            
            if (verse) {
                verses.push(verse);
                
                if (size > 1) {
                    const verse2 = this.Settings.availableVerses[index + 1];

                    if (verse2) {
                        verses.push(verse2);
                    }
                }
            }
        }
        return verses;
    }

    public get Verses() {
        return Object.entries(this.Lyrics?.verses ?? {})
            .filter(i => this.currentVerses.includes(i[0]))
            .map(i => i[1]);
    }
}

export const viewer = new PresentationViewer();
