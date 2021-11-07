import Book from "@/classes/scriptures/book";
import Chapter from "@/classes/scriptures/chapter";
import Scripture from "@/classes/scriptures/scripture";
import Translation from "@/classes/scriptures/translation";
import Verse from "@/classes/scriptures/verse";
import { scriptures } from "../api";

class Scriptures {
    private scriptures: Scripture[] | null = null;
    private translations: {
        [scriptureId: string]: Translation[];
    } = {};
    private books: {
        [translationId: string]: Book[];
    } = {};

    private _initializing = false;
    public async initialize() {
        if (this.scriptures === null && !this._initializing) {
            this._initializing = true;
            this.scriptures = (await scriptures.getAll()).map(s => new Scripture(s));
            
        }
    }

    public async get(id: string): Promise<Scripture> {
        let scripture = this.scriptures?.find(s => s.id === id);
        if (!scripture) {
            scripture = await scriptures.getScripture(id);
        }
        return scripture;
    }

    public async getTranslations(scriptureId: string): Promise<Translation[]> {
        if (this.translations[scriptureId] === undefined) {
            this.translations[scriptureId] = await scriptures.getTranslations(scriptureId);
        }
        return this.translations[scriptureId];
    }

    public async getTranslation(scriptureId: string, id: string): Promise<Translation> {
        const translation = (await scriptures.getTranslations(scriptureId)).find(t => t.id === id);
        if (!translation) {
            throw new Error("Translation not found");
        }
        return translation;
    }

    public async getBooks(translationId: string): Promise<Book[]> {
        if (this.books[translationId] === undefined) {
            this.books[translationId] = await scriptures.getBooks(translationId);
        }
        return this.books[translationId];
    }

    public async getBook(translationId: string, id: string): Promise<Book> {
        const book = (await this.getBooks(translationId)).find(t => t.id === id);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    }

    public async getChapters(translationId: string, bookId: string): Promise<Chapter[]> {
        const book = await this.getBook(translationId, bookId);
        if (book.chapters === null) {
            book.chapters = (await scriptures.getChapters(translationId, bookId)).map(c => new Chapter(c));
        }
        return book.chapters;
    }

    public async getChapter(translationId: string, bookId: string, id: string): Promise<Chapter> {
        const chapter = (await this.getChapters(translationId, bookId)).find(t => t.id === id);
        if (!chapter) {
            throw new Error("Book not found");
        }
        return chapter;
    }

    public async getVerses(translationId: string, bookId: string, chapterId: string) {
        const chapter = await this.getChapter(translationId, bookId, chapterId);
        if (chapter.verses === null) {
            chapter.verses = (await scriptures.getVerses(translationId, bookId, chapterId)).map(v => new Verse(v));
        }
        return chapter.verses;
    }
}

export default new Scriptures();
