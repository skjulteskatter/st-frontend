import { BandSyncSession } from "@/services/bandSync/bandSyncSession";

export const bandSyncService = {
    getDeviceId: () => "test-device-id",
    watchSession: (
        _code: string,
        _onChange: (session: BandSyncSession | null) => void,
        _onError?: (error: Error) => void,
    ) => () => undefined,
    createSession: async (): Promise<BandSyncSession> => {
        throw new Error("not implemented in test mock");
    },
    joinSession: async (): Promise<BandSyncSession> => {
        throw new Error("not implemented in test mock");
    },
    updateSession: async (): Promise<void> => undefined,
    renewSession: async (): Promise<Date> => new Date(Date.now() + 864000000),
    claimLead: async (): Promise<BandSyncSession> => {
        throw new Error("not implemented in test mock");
    },
    endSession: async (): Promise<void> => undefined,
    savePersistedSession: (): void => undefined,
    readPersistedSession: () => null,
    clearPersistedSession: (): void => undefined,
    normalizeCode: (code: string) => code.trim().toUpperCase(),
    generateCode: () => "ABC123",
};
