import Book from "@/classes/scriptures/book";
import Chapter from "@/classes/scriptures/chapter";
import Scripture from "@/classes/scriptures/scripture";
import Translation from "@/classes/scriptures/translation";
import Verse from "@/classes/scriptures/verse";
import { scriptures } from "../api";

export default class BaseScriptures {
    protected scriptures: Scripture[] = [];
    protected translations: Translation[] = [];
    protected books: {
        [translationId: string]: Book[];
    } = {};

    private _initializing = false;
    private _initialized = false;

    public async initialize() {
        if (!this._initialized && !this._initializing) {
            this._initializing = true;
            this.scriptures = (await scriptures.getAll()).map(s => new Scripture(s));
            this._initialized = true;
            this._initializing = false;
        }
    }

    public async get(id: string): Promise<Scripture> {
        let scripture = this.scriptures?.find(s => s.id === id || Object.keys(s.key).includes(id));
        if (!scripture) {
            scripture = new Scripture(await scriptures.getScripture(id));
        }
        return scripture;
    }

    public async getTranslations(scriptureId: string): Promise<Translation[]> {
        if (!this.translations.some(t => t.scriptureId === scriptureId)) {
            this.translations.push(...(await scriptures.getTranslations(scriptureId)).map(i => new Translation(i)));
        }
        return this.translations.filter(t => t.scriptureId === scriptureId);
    }

    public async getTranslation(scriptureId: string, id: string): Promise<Translation> {
        const translation = (await this.getTranslations(scriptureId)).find(t => t.id === id || t.sourceName === id);
        if (!translation) {
            throw new Error("Translation not found");
        }
        return translation;
    }

    public async getBooks(translationId: string): Promise<Book[]> {
        if (this.books[translationId] === undefined) {
            this.books[translationId] = (await scriptures.getBooks(translationId))
                .map(i => new Book(i))
                .sort((a, b) => a.number > b.number ? 1 : -1);
        }
        return this.books[translationId];
    }

    public async getBook(translationId: string, id: string): Promise<Book> {
        const number = parseInt(id);
        const books = await this.getBooks(translationId);
        const book = books.find(t => t.id === id || t.shortTitle === id || t.number === number);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    }

    public async getChapters(translationId: string, bookId: string): Promise<Chapter[]> {
        const book = await this.getBook(translationId, bookId);
        if (book.chapters === null) {
            book.chapters = (await scriptures.getChapters(translationId, book.id))
                .map(c => new Chapter(c))
                .sort((a, b) => a.number > b.number ? 1 : -1);
        }
        return book.chapters;
    }

    public async getChapter(translationId: string, bookId: string, id: string): Promise<Chapter> {
        const number = parseInt(id);
        const chapters = await this.getChapters(translationId, bookId);
        const chapter = chapters.find(t => t.id === id || t.number === number);
        if (!chapter) {
            throw new Error("Chapter not found");
        }
        return chapter;
    }

    public async getVerses(translationId: string, bookId: string, chapterId: string) {
        const chapter = await this.getChapter(translationId, bookId, chapterId);
        if (chapter.verses === null) {
            chapter.verses = (await scriptures.getVerses(translationId, chapter.bookId, chapter.id)).map(v => new Verse(v));
        }
        return chapter.verses;
    }
}
