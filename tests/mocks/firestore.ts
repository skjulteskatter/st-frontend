export class Timestamp {
    private constructor(private readonly date: Date) {}

    static fromDate(date: Date): Timestamp {
        return new Timestamp(date);
    }

    toDate(): Date {
        return this.date;
    }
}

export const getFirestore = (): Record<string, unknown> => ({});
export const collection = (): Record<string, unknown> => ({});
export const doc = (): Record<string, unknown> => ({});
export const onSnapshot = (): void => undefined;
export const getDoc = async (): Promise<{ exists: boolean; data: () => null }> => ({
    exists: false,
    data: () => null,
});
export const writeBatch = () => ({
    set: (): void => undefined,
    delete: (): void => undefined,
    commit: async (): Promise<void> => undefined,
});
export const updateDoc = async (): Promise<void> => undefined;
