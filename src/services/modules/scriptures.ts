import { cache } from "../cache";
import BaseScriptures from "./baseScriptures";

class Scriptures extends BaseScriptures {
    private _scriptureId: string | null = null;
    private _translationId: {
        [scriptureId: string]: string | undefined;
    } = {};
    private _bookId: {
        [scriptureId: string]: number | undefined;
    } = {};

    public get Scriptures() {
        return this.scriptures;
    }

    public async getCurrentScripture() {
        return this._scriptureId ? await this.get(this._scriptureId) : null;
    }

    public get Translations() {
        return this.translations;
    }

    public async getCurrentTranslation() {
        const scripture = await this.getCurrentScripture();

        if (scripture) {
            const id = this._translationId[scripture.id] ?? 
                await cache.get("config", `translation:${scripture.id}`) as string | undefined;
            if (id) {
                const translation = await this.getTranslation(scripture.id, id);
                if (translation) {
                    this._translationId[scripture.id] = translation.id;
                    return translation;
                }
            }
        }
        return null;
    }

    public async getCurrentBook() {
        try {
            const translation = await this.getCurrentTranslation();
            if (translation) {
                const number = this._bookId[translation.scriptureId];
                
                if (number) {
                    const book = await this.getBook(translation.id, number.toString());
                    this._bookId[translation.scriptureId] = book.number;
                    return book;
                }
            }
            return null;
        }
        catch {
            return null;
        }
    }

    public async setScripture(id: string) {
        const scripture = await this.get(id);
        if (scripture) {
            this._scriptureId = scripture.id;
        }
    }

    public async setTranslation(id: string) {
        const scripture = await this.getCurrentScripture();
        if (scripture) {
            const translation = await this.getTranslation(scripture.id, id);
            if (translation) {
                this._translationId[scripture.id] = translation.id;
                await cache.set("config", `translation:${scripture.id}`, translation.id);
            }
        }
    }

    public async setBook(number: number) {
        const translation = await this.getCurrentTranslation();
        if (translation) {
            const book = await this.getBook(translation.id, number.toString());
            this._bookId[translation.scriptureId] = book.number;
        }
    }
}

export default new Scriptures();
