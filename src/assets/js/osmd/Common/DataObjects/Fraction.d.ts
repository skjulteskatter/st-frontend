/**
 * A class representing mathematical fractions, which have a numerator and a denominator.
 */
export declare class Fraction {
    private static maximumAllowedNumber;
    private numerator;
    private denominator;
    private wholeValue;
    private realValue;
    /**
     * Returns the maximum of two fractions (does not clone)
     * @param f1
     * @param f2
     * @returns {Fraction}
     */
    static max(f1: Fraction, f2: Fraction): Fraction;
    static Equal(f1: Fraction, f2: Fraction): boolean;
    /**
     * The same as Fraction.clone
     * @param fraction
     * @returns {Fraction}
     */
    static createFromFraction(fraction: Fraction): Fraction;
    static plus(f1: Fraction, f2: Fraction): Fraction;
    static minus(f1: Fraction, f2: Fraction): Fraction;
    static multiply(f1: Fraction, f2: Fraction): Fraction;
    private static greatestCommonDenominator;
    /**
     *
     * @param numerator
     * @param denominator
     * @param wholeValue - the integer number, needed for values greater than 1
     * @param simplify - If simplify is true, then the fraction is simplified
     * to make both the numerator and denominator coprime, and less than maximumAllowedNumber.
     */
    constructor(numerator?: number, denominator?: number, wholeValue?: number, simplify?: boolean);
    toString(): string;
    clone(): Fraction;
    get Numerator(): number;
    set Numerator(value: number);
    get Denominator(): number;
    set Denominator(value: number);
    get WholeValue(): number;
    set WholeValue(value: number);
    /**
     * Returns the unified numerator where the whole value will be expanded
     * with the denominator and added to the existing numerator.
     */
    GetExpandedNumerator(): number;
    IsNegative(): boolean;
    get RealValue(): number;
    expand(expansionValue: number): void;
    /**
     * Adds a Fraction to this Fraction.
     * Attention: This changes the already existing Fraction, which might be referenced elsewhere!
     * Use Fraction.plus() for creating a new Fraction object being the sum of two Fractions.
     * @param fraction the Fraction to add.
     */
    Add(fraction: Fraction): Fraction;
    /**
     * Subtracts a Fraction from this Fraction.
     * Attention: This changes the already existing Fraction, which might be referenced elsewhere!
     * Use Fraction.minus() for creating a new Fraction object being the difference of two Fractions.
     * @param fraction the Fraction to subtract.
     */
    Sub(fraction: Fraction): Fraction;
    /**
     * Creates a new Fraction which is half as long as this Fraction
     */
    getHalfLength(): Fraction;
    /**
     * Brute Force quanization by searching incremental with the numerator until the denominator is
     * smaller/equal than the desired one.
     * @param maxAllowedDenominator
     */
    Quantize(maxAllowedDenominator: number): Fraction;
    Equals(obj: Fraction): boolean;
    CompareTo(obj: Fraction): number;
    lt(frac: Fraction): boolean;
    lte(frac: Fraction): boolean;
    gt(frac: Fraction): boolean;
    gte(frac: Fraction): boolean;
    private setRealValue;
    private simplify;
    static FloatInaccuracyTolerance: number;
    isOnBeat(timeSignature: Fraction): boolean;
    distanceFromBeat(timeSignature: Fraction): number;
}
