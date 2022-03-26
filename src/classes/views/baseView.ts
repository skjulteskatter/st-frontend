export default abstract class BaseView {
    protected loaded = false;

    protected abstract load(): Promise<void>;

    protected notLoaded() {
        return new Error("View not loaded");
    }
}
