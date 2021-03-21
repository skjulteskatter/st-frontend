/**
 * Class with helper methods to handle asynchronous JavaScript requests
 */
export declare class AJAX {
    /**
     * Retrieve the content of the file at url
     * @param url
     * @returns {any}
     */
    static ajax(url: string, timeout?: number): Promise<string>;
}
