export default abstract class BaseService<T> {
    public abstract get(id: string): Promise<T>;

    public items: T[] = [];
}
