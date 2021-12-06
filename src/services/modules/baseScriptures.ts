import Book from "@/classes/scriptures/book";
import Chapter from "@/classes/scriptures/chapter";
import Scripture from "@/classes/scriptures/scripture";
import Translation from "@/classes/scriptures/translation";
import Verse from "@/classes/scriptures/verse";
import { scriptures } from "../api";
import { cache } from "../cache";

export default class BaseScriptures {
    protected scriptures: Scripture[] = [];
    protected translations: Translation[] = [];
    protected books: Book[] = [];
    protected chapters: Chapter[] = [];

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
        const scripture = this.scriptures?.find(s => s.id === id || Object.values(s.key).contains(id));
        if (!scripture) {
            throw new Error("Scripture not found");
        }
        return scripture;
    }

    public async getTranslations(scriptureId: string): Promise<Translation[]> {
        if (!this.translations.some(t => t.scriptureId === scriptureId)) {
            this.translations.push(...(await scriptures.getTranslations(scriptureId)).map(i => new Translation(i)));
        }
        return this.translations.filter(t => t.scriptureId === scriptureId);
    }

    public async getTranslation(id: string): Promise<Translation> {
        const translation = this.translations.find(i => i.id === id) ?? 
            new Translation(await cache.getOrCreate("translations", id, () => scriptures.getTranslation(id)));
        if (!translation) {
            throw new Error("Translation not found");
        }
        return translation;
    }

    public async getBooks(translationId: string): Promise<Book[]> {
        if (!this.books.some(i => i.translationId === translationId)) {
            this.books.push(...(await scriptures.getBooks(translationId))
                .map(i => new Book(i))
                .sort((a, b) => a.number > b.number ? 1 : -1),
            );
        }
        return this.books.filter(b => b.translationId === translationId);
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

    public async getChapters(bookId: string): Promise<Chapter[]> {
        if (!this.chapters.some(i => i.bookId === bookId)) {
            this.chapters.push(...(await scriptures.getChapters(bookId))
                .map(i => new Chapter(i))
                .sort((a, b) => a.number > b.number ? 1 : -1),
            );
        }
        return this.chapters.filter(i => i.bookId === bookId);
    }

    public async getChapter(bookId: string, id: string): Promise<Chapter> {
        const number = parseInt(id);
        const chapters = await this.getChapters(bookId);
        const chapter = chapters.find(t => t.id === id || t.number === number);
        if (!chapter) {
            throw new Error("Chapter not found");
        }
        return chapter;
    }

    public async getVerses(bookId: string, chapterId: string) {
        const chapter = await this.getChapter(bookId, chapterId);
        if (chapter.verses === null) {
            chapter.verses = (await scriptures.getVerses(chapter.id)).map(v => new Verse(v));
        }
        return chapter.verses;
    }
}
