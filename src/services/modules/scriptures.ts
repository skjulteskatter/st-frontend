import { Book, Chapter } from "@/classes/scriptures";
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
    private _chapterId: {
        [bookNumber: number]: number | undefined;
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
                const translation = await this.getTranslation(id);
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

    public async getCurrentChapter() {
        try {
            const book = await this.getCurrentBook();
            if (book) {
                const number = this._chapterId[book.number];
                
                if (number) {
                    const chapter = await this.getChapter(book.id, number.toString());
                    this._chapterId[book.number] = chapter.number;
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
            const translation = await this.getTranslation(id);
            if (translation) {
                this._translationId[scripture.id] = translation.id;
                await cache.set("config", `translation:${scripture.id}`, translation.id);
            }
        }
    }

    public async setBook(number?: number) {
        const translation = await this.getCurrentTranslation();
        if (translation) {
            if (number) {
                const book = await this.getBook(translation.id, number.toString());
                this.onBookSelected?.(book);
                this._bookId[translation.scriptureId] = book.number;
            } else {
                this.onBookSelected?.(null);
                delete this._bookId[translation.scriptureId];
            }
        }
    }

    public async setChapter(number?: number) {
        const book = await this.getCurrentBook();
        if (book) {
            if (number) {
                const chapter = await this.getChapter(book.id, number.toString());
                this.onChapterSelected?.(chapter);
                this._chapterId[book.number] = chapter.number;
            } else {
                this.onChapterSelected?.(null);
                delete this._chapterId[book.number];
            }
        }
    }

    public get CurrentScripture() {
        return this._scriptureId ? this.scriptures.find(s => s.id === this._scriptureId) : null;
    }

    public get CurrentTranslation() {
        const scripture = this.CurrentScripture;
        if (scripture) {
            return this._translationId[scripture.id] ? 
                this.translations.find(t => t.id === this._translationId[scripture.id])
                ?? null : null;
        }
        return null;
    }

    public get CurrentBook() {
        const translation = this.CurrentTranslation;
        if (translation) {
            return this._bookId[translation.scriptureId] ? 
                this.books.find(t => t.number === this._bookId[translation.scriptureId] && t.translationId === translation.id)
                ?? null : null;
        }
        return null;
    }

    public get CurrentChapter() {
        const book = this.CurrentBook;
        if (book) {
            return this._chapterId[book.number] ?
                book.chapters?.find(c => c.number === this._chapterId[book.number])
                ?? null : null;
        }
        return null;
    }

    public get Chapters() {
        return this.CurrentBook?.chapters ?? [];
    }

    public get Books() {
        return this.books ?? [];
    }

    public onBookSelected?: (book: Book | null) => void;
    public onChapterSelected?: (chapter: Chapter | null) => void;
}

export default new Scriptures();
