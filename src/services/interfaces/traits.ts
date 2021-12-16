export interface Deleteable {
    delete: () => Promise<void>;
}
export interface Refreshable {
    refresh: () => Promise<void>;
}
