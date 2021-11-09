import { cache } from "../cache";
import BaseScriptures from "./baseScriptures";

class Scriptures extends BaseScriptures {
    private _scriptureId: string | null = null;
    private _translationId: {
        [scriptureId: string]: string | undefined;
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
}

export default new Scriptures();
