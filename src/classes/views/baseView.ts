export default abstract class BaseView<T extends {id: string}> {
    private _item: T | null = null;
    protected itemId: string;

    public get item() {
        if (!this._item)
            throw this.notLoaded();
        return this._item;
    }
    public set item(v) {
        this._item = v;
    }

    constructor(item: T | string) {
        if (typeof(item) === "string") {
            this.itemId = item;
        } else {
            this._item = item;
            this.itemId = item.id;
        }
    }

    protected abstract doLoad(): Promise<void>;
    protected abstract getItem(): Promise<T>;

    public loaded = false;
    public loading = false;

    public async load() {
        if (!this.loaded) {
            this.loading = true;
            this._item ??= await this.getItem();
            await this.doLoad();
            this.loading = false;
            this.loaded = true;
        }
    }

    protected notLoaded() {
        return new Error("View not loaded");
    }
}
