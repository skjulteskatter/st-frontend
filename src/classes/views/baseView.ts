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

    public loaded = false;

    public async load() {
        if (!this.loaded) {
            await this.doLoad();
            this.loaded = true;
        }
    }

    protected notLoaded() {
        return new Error("View not loaded");
    }
}
