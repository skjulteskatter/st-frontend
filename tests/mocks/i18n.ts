export async function ensureLanguageIsFetched(): Promise<void> {
    return undefined;
}

export default {
    global: {
        t: (key: string): string => key,
    },
};
