import { Dictionary } from "typescript-collections";
declare global {
    interface Array<T> {
        /** Returns the last element from an array */
        last(): T;
        /** Deletes all elements from an array */
        clear(): void;
        /** Returns true if the element is found in the array */
        contains(elem: T): boolean;
    }
}
/**
 * This class implements static methods to perform useful operations on lists, dictionaries, ...
 */
export declare class CollectionUtil {
    static contains2(array: any[], object: any): boolean;
    static last(array: any[]): any;
    /**
     * Iterates through a dictionary and calls iterationFunction.
     * If iterationFunction returns true the key gets stored.
     * all stored key will finally be removed from the dictionary.
     * @param dict
     * @param iterationFunction
     */
    static removeDictElementIfTrue<S, T, V>(thisPointer: S, dict: Dictionary<T, V>, iterationFunction: (thisPointer: S, key: T, value: V) => boolean): void;
    static getLastElement<T>(array: T[]): T;
    static binarySearch<T>(array: T[], element: T, cmp: (elem1: T, elem2: T) => number, startIndex?: number, endIndex?: number): number;
}
