import {
    getFirestore,
    doc,
    collection,
    onSnapshot,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    Unsubscribe,
} from "firebase/firestore";
import { firebaseApp, a } from "@/services/auth";
import {
    BandSyncException,
    BandSyncPersistedSession,
    BandSyncSession,
    CODE_CHARS,
    CODE_LENGTH,
    ANOTHER_DEVICE_LEADING,
    computeSessionExpireAt,
    fromFirestore,
    isExpired,
    isLedByDevice,
    roleFromStorage,
    roleToStorage,
} from "./bandSyncSession";

const STORAGE_KEYS = {
    code: "bandSyncCode",
    role: "bandSyncRole",
    songbookId: "bandSyncSongbookId",
    followingLeaderUpdates: "bandSyncFollowingLeaderUpdates",
    deviceId: "bandSyncDeviceId",
} as const;

class BandSyncService {
    private firestore = getFirestore(firebaseApp);

    private sessionsRef = collection(this.firestore, "bandSessions");

    /**
     * Per-tab id (sessionStorage). localStorage is shared across tabs of the
     * same origin, so it cannot distinguish two windows of the same browser.
     */
    getDeviceId(): string {
        const existing = sessionStorage.getItem(STORAGE_KEYS.deviceId);
        if (existing) {
            return existing;
        }
        const deviceId = crypto.randomUUID();
        sessionStorage.setItem(STORAGE_KEYS.deviceId, deviceId);
        return deviceId;
    }

    watchSession(
        code: string,
        onChange: (session: BandSyncSession | null) => void,
        onError?: (error: Error) => void,
    ): Unsubscribe {
        return onSnapshot(
            doc(this.sessionsRef, this.normalizeCode(code)),
            (snapshot) => {
                if (!snapshot.exists() || !snapshot.data()) {
                    onChange(null);
                    return;
                }

                try {
                    const session = fromFirestore(snapshot.id, snapshot.data());
                    if (isExpired(session)) {
                        onChange(null);
                        return;
                    }
                    onChange(session);
                } catch {
                    onChange(null);
                }
            },
            (error) => {
                onError?.(error);
            },
        );
    }

    async createSession({
        songbookId,
        songNumber,
        transposition,
    }: {
        songbookId: string;
        songNumber: number;
        transposition: number;
    }): Promise<BandSyncSession> {
        const user = a.currentUser;
        if (!user) {
            throw new BandSyncException("Leader must be logged in.");
        }

        const now = new Date();
        const expireAt = computeSessionExpireAt(now);
        const code = await this.generateUniqueCode();
        const deviceId = this.getDeviceId();

        const session: BandSyncSession = {
            sessionId: code,
            code,
            leaderId: user.uid,
            leaderDeviceId: deviceId,
            songbookId,
            songNumber,
            transposition,
            createdAt: now,
            updatedAt: now,
            expireAt,
        };

        await setDoc(doc(this.sessionsRef, code), {
            leaderId: session.leaderId,
            leaderDeviceId: deviceId,
            songbookId: session.songbookId,
            songNumber: session.songNumber,
            transposition: session.transposition,
            createdAt: Timestamp.fromDate(session.createdAt),
            updatedAt: Timestamp.fromDate(session.updatedAt),
            expireAt: Timestamp.fromDate(session.expireAt),
        });

        return session;
    }

    async joinSession(code: string): Promise<BandSyncSession> {
        const normalizedCode = this.normalizeCode(code);
        if (!normalizedCode) {
            throw new BandSyncException("Invalid session code.");
        }

        const sessionDoc = await getDoc(doc(this.sessionsRef, normalizedCode));
        if (!sessionDoc.exists() || !sessionDoc.data()) {
            throw new BandSyncException("Session not found.");
        }

        const session = fromFirestore(sessionDoc.id, sessionDoc.data());
        if (isExpired(session)) {
            throw new BandSyncException("Session has expired.");
        }

        return session;
    }

    private async readActiveSession(code: string): Promise<BandSyncSession> {
        const sessionDoc = await getDoc(doc(this.sessionsRef, this.normalizeCode(code)));
        if (!sessionDoc.exists() || !sessionDoc.data()) {
            throw new BandSyncException("Session not found.");
        }
        const session = fromFirestore(sessionDoc.id, sessionDoc.data());
        if (isExpired(session)) {
            throw new BandSyncException("Session has expired.");
        }
        return session;
    }

    async updateSession({
        code,
        songbookId,
        songNumber,
        transposition,
    }: {
        code: string;
        songbookId: string;
        songNumber: number;
        transposition: number;
    }): Promise<void> {
        const user = a.currentUser;
        if (!user) {
            throw new BandSyncException("Leader must be logged in.");
        }

        const session = await this.readActiveSession(code);
        if (session.leaderId !== user.uid) {
            throw new BandSyncException("Only the session leader can publish.");
        }
        if (!isLedByDevice(session, this.getDeviceId())) {
            throw new BandSyncException(ANOTHER_DEVICE_LEADING);
        }

        const deviceId = this.getDeviceId();
        const stampClaim =
            session.leaderDeviceId == null || session.leaderDeviceId === "";

        await updateDoc(doc(this.sessionsRef, this.normalizeCode(code)), {
            songbookId,
            songNumber,
            transposition,
            updatedAt: Timestamp.now(),
            ...(stampClaim ? { leaderDeviceId: deviceId } : {}),
        });
    }

    async renewSession({ code }: { code: string }): Promise<Date> {
        const user = a.currentUser;
        if (!user) {
            throw new BandSyncException("Leader must be logged in.");
        }

        const session = await this.readActiveSession(code);
        if (session.leaderId !== user.uid) {
            throw new BandSyncException("Only the session leader can renew.");
        }
        if (!isLedByDevice(session, this.getDeviceId())) {
            throw new BandSyncException(ANOTHER_DEVICE_LEADING);
        }

        const expireAt = computeSessionExpireAt(new Date());

        await updateDoc(doc(this.sessionsRef, this.normalizeCode(code)), {
            expireAt: Timestamp.fromDate(expireAt),
        });

        return expireAt;
    }

    async claimLead({ code }: { code: string }): Promise<BandSyncSession> {
        const user = a.currentUser;
        if (!user) {
            throw new BandSyncException("Leader must be logged in.");
        }

        const session = await this.readActiveSession(code);
        if (session.leaderId !== user.uid) {
            throw new BandSyncException("Only the session leader can take the lead.");
        }

        const deviceId = this.getDeviceId();
        const now = new Date();
        await updateDoc(doc(this.sessionsRef, this.normalizeCode(code)), {
            leaderDeviceId: deviceId,
            updatedAt: Timestamp.fromDate(now),
        });

        return {
            ...session,
            leaderDeviceId: deviceId,
            updatedAt: now,
        };
    }

    async endSession({ code }: { code: string }): Promise<void> {
        const user = a.currentUser;
        if (!user) {
            throw new BandSyncException("Leader must be logged in.");
        }

        const session = await this.readActiveSession(code);
        if (session.leaderId !== user.uid) {
            throw new BandSyncException("Only the session leader can end the session.");
        }
        if (!isLedByDevice(session, this.getDeviceId())) {
            throw new BandSyncException(ANOTHER_DEVICE_LEADING);
        }

        await deleteDoc(doc(this.sessionsRef, this.normalizeCode(code)));
    }

    /**
     * Session membership (code / songbook) is shared in localStorage.
     * Role is per-tab in sessionStorage so one tab demoting cannot rewrite
     * another tab's leader status.
     */
    savePersistedSession(session: BandSyncPersistedSession): void {
        localStorage.setItem(STORAGE_KEYS.code, session.code);
        localStorage.setItem(STORAGE_KEYS.songbookId, session.songbookId);
        // Stop sharing role across tabs (legacy localStorage).
        localStorage.removeItem(STORAGE_KEYS.role);
        localStorage.removeItem(STORAGE_KEYS.followingLeaderUpdates);

        sessionStorage.setItem(STORAGE_KEYS.role, roleToStorage(session.role));
        if (session.role === "member") {
            sessionStorage.setItem(
                STORAGE_KEYS.followingLeaderUpdates,
                session.followingLeaderUpdates === false ? "false" : "true",
            );
        } else {
            sessionStorage.removeItem(STORAGE_KEYS.followingLeaderUpdates);
        }
    }

    readPersistedSession(): BandSyncPersistedSession | null {
        const code = localStorage.getItem(STORAGE_KEYS.code);
        const songbookId = localStorage.getItem(STORAGE_KEYS.songbookId);

        if (!code || !songbookId) {
            return null;
        }

        const roleValue =
            sessionStorage.getItem(STORAGE_KEYS.role) ??
            localStorage.getItem(STORAGE_KEYS.role);

        // Another tab already joined this session: default to member.
        if (!roleValue) {
            return {
                code,
                role: "member",
                songbookId,
                followingLeaderUpdates: true,
            };
        }

        const role = roleFromStorage(roleValue);
        if (role === "none") {
            return null;
        }

        // Migrate legacy shared role into this tab's sessionStorage.
        if (!sessionStorage.getItem(STORAGE_KEYS.role)) {
            sessionStorage.setItem(STORAGE_KEYS.role, roleToStorage(role));
            localStorage.removeItem(STORAGE_KEYS.role);
        }

        const followingRaw =
            sessionStorage.getItem(STORAGE_KEYS.followingLeaderUpdates) ??
            localStorage.getItem(STORAGE_KEYS.followingLeaderUpdates);
        const followingLeaderUpdates =
            role === "member"
                ? followingRaw !== "false"
                : undefined;

        return { code, role, songbookId, followingLeaderUpdates };
    }

    clearPersistedSession(): void {
        localStorage.removeItem(STORAGE_KEYS.code);
        localStorage.removeItem(STORAGE_KEYS.role);
        localStorage.removeItem(STORAGE_KEYS.songbookId);
        localStorage.removeItem(STORAGE_KEYS.followingLeaderUpdates);
        localStorage.removeItem(STORAGE_KEYS.deviceId);
        localStorage.removeItem("bandSyncSessionId");
        sessionStorage.removeItem(STORAGE_KEYS.role);
        sessionStorage.removeItem(STORAGE_KEYS.followingLeaderUpdates);
        // Keep sessionStorage deviceId for this tab's identity.
    }

    normalizeCode(code: string): string {
        return code.trim().toUpperCase();
    }

    generateCode(): string {
        const random = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
        let result = "";
        for (let i = 0; i < CODE_LENGTH; i++) {
            result += CODE_CHARS[random[i] % CODE_CHARS.length];
        }
        return result;
    }

    private async generateUniqueCode(): Promise<string> {
        for (let attempt = 0; attempt < 20; attempt++) {
            const code = this.generateCode();
            const existing = await getDoc(doc(this.sessionsRef, code));
            if (!existing.exists()) {
                return code;
            }
        }
        throw new BandSyncException("Could not generate a session code.");
    }
}

export const bandSyncService = new BandSyncService();
