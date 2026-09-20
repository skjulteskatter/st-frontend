import { expect } from "chai";
import { Timestamp } from "firebase/firestore";
import {
    CODE_CHARS,
    CODE_LENGTH,
    computeSessionExpireAt,
    formatSessionExpiry,
    fromFirestore,
    hasLeaderStateChangedComparedTo,
    isExpired,
    isLedByDevice,
    matchesSongState,
    roleFromStorage,
    samePitchClass,
    sessionTranspositionFromApi,
    SESSION_TTL_DAYS,
    toSheetApiTransposition,
} from "@/services/bandSync/bandSyncSession";

function makeSession(overrides: Record<string, unknown> = {}) {
    const now = new Date("2026-01-01T12:00:00Z");
    const expireAt = new Date("2026-01-11T12:00:00Z");
    return fromFirestore("ABC123", {
        leaderId: "leader-1",
        songbookId: "book-1",
        songNumber: 42,
        transposition: 2,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        expireAt: Timestamp.fromDate(expireAt),
        ...overrides,
    });
}

describe("bandSyncSession", () => {
    it("fromFirestore parses session fields", () => {
        const session = makeSession();
        expect(session.sessionId).to.equal("ABC123");
        expect(session.code).to.equal("ABC123");
        expect(session.songNumber).to.equal(42);
        expect(session.transposition).to.equal(2);
        expect(session.leaderDeviceId).to.equal(null);
    });

    it("fromFirestore parses leaderDeviceId", () => {
        const session = makeSession({ leaderDeviceId: "device-abc" });
        expect(session.leaderDeviceId).to.equal("device-abc");
    });

    it("isLedByDevice matches claim and treats legacy null as any device", () => {
        expect(isLedByDevice(makeSession(), "device-a")).to.equal(true);
        expect(isLedByDevice(makeSession({ leaderDeviceId: "" }), "device-a")).to.equal(
            true,
        );
        expect(
            isLedByDevice(makeSession({ leaderDeviceId: "device-a" }), "device-a"),
        ).to.equal(true);
        expect(
            isLedByDevice(makeSession({ leaderDeviceId: "device-a" }), "device-b"),
        ).to.equal(false);
    });

    it("fromFirestore derives code from doc ID, not data.code", () => {
        const session = fromFirestore("XYZ789", {
            code: "IGNORED",
            leaderId: "leader-1",
            songbookId: "book-1",
            songNumber: 1,
            transposition: 0,
            createdAt: Timestamp.fromDate(new Date("2026-01-01T12:00:00Z")),
            updatedAt: Timestamp.fromDate(new Date("2026-01-01T12:00:00Z")),
            expireAt: Timestamp.fromDate(new Date("2026-01-11T12:00:00Z")),
        });
        expect(session.code).to.equal("XYZ789");
        expect(session.sessionId).to.equal("XYZ789");
    });

    it("fromFirestore falls back updatedAt to createdAt", () => {
        const createdAt = new Date("2026-01-01T12:00:00Z");
        const session = fromFirestore("ABC123", {
            leaderId: "leader-1",
            songbookId: "book-1",
            songNumber: 1,
            transposition: 0,
            createdAt: Timestamp.fromDate(createdAt),
            expireAt: Timestamp.fromDate(new Date("2026-01-11T12:00:00Z")),
        });
        expect(session.updatedAt.getTime()).to.equal(createdAt.getTime());
    });

    it("samePitchClass treats signed and 0–11 encodings as equal", () => {
        expect(samePitchClass(-2, 10)).to.equal(true);
        expect(samePitchClass(10, -2)).to.equal(true);
        expect(samePitchClass(0, 12)).to.equal(true);
        expect(samePitchClass(-2, 0)).to.equal(false);
    });

    it("toSheetApiTransposition matches Flutter SheetsCubit formula", () => {
        // session -2 (Bb concert for song in C): C → -2, Bb → 0, Eb → 7
        expect(toSheetApiTransposition(-2, "C")).to.equal(-2);
        expect(toSheetApiTransposition(-2, "Bb")).to.equal(0);
        expect(toSheetApiTransposition(-2, "Eb")).to.equal(7);
        // at-rest session 0: sheet opens at instrument default (smTs)
        expect(toSheetApiTransposition(0, "Bb")).to.equal(2);
        expect(toSheetApiTransposition(0, "C")).to.equal(0);
    });

    it("sessionTranspositionFromApi prefers song map entry then falls back", () => {
        const songTranspositions = { C: 0, Bb: -2, G: 5 };
        // Bb instrument, API 0 ↔ session -2 via map
        expect(sessionTranspositionFromApi(0, "Bb", songTranspositions)).to.equal(-2);
        // C instrument, API -2 ↔ session -2
        expect(sessionTranspositionFromApi(-2, "C", songTranspositions)).to.equal(-2);
        // No matching map entry → api - userKey
        expect(sessionTranspositionFromApi(3, "Bb", {})).to.equal(1);
    });

    it("matchesSongState returns true when state matches", () => {
        const session = makeSession();
        expect(matchesSongState(session, "book-1", 42, 2)).to.equal(true);
    });

    it("matchesSongState equates pitch-class equivalent transpositions", () => {
        const session = makeSession({ transposition: 10 });
        expect(matchesSongState(session, "book-1", 42, -2)).to.equal(true);
    });

    it("matchesSongState returns false when song number differs", () => {
        const session = makeSession();
        expect(matchesSongState(session, "book-1", 99, 2)).to.equal(false);
    });

    it("isExpired returns true after expireAt", () => {
        const session = makeSession();
        expect(isExpired(session, new Date("2026-01-12T00:00:00Z"))).to.equal(true);
        expect(isExpired(session, new Date("2026-01-05T00:00:00Z"))).to.equal(false);
    });

    it("computeSessionExpireAt adds SESSION_TTL_DAYS", () => {
        const from = new Date("2026-01-01T12:00:00Z");
        const expireAt = computeSessionExpireAt(from);
        const expected = new Date(from.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
        expect(expireAt.getTime()).to.equal(expected.getTime());
    });

    it("formatSessionExpiry returns relative, absolute, and urgency", () => {
        const now = new Date("2026-01-01T12:00:00Z");
        const expireAt = new Date("2026-01-02T10:00:00Z");
        const display = formatSessionExpiry(expireAt, "en", now);

        expect(display.relative).to.be.a("string");
        expect(display.absolute).to.be.a("string");
        expect(display.isUrgent).to.equal(true);
    });

    it("formatSessionExpiry is not urgent when more than 24h remain", () => {
        const now = new Date("2026-01-01T12:00:00Z");
        const expireAt = new Date("2026-01-05T12:00:00Z");
        const display = formatSessionExpiry(expireAt, "en", now);

        expect(display.isUrgent).to.equal(false);
    });

    it("hasLeaderStateChangedComparedTo detects transposition change", () => {
        const session = makeSession();
        const changed = makeSession({
            transposition: 5,
            updatedAt: Timestamp.fromDate(new Date("2026-01-02T12:00:00Z")),
        });
        expect(hasLeaderStateChangedComparedTo(session, session)).to.equal(false);
        expect(hasLeaderStateChangedComparedTo(changed, session)).to.equal(true);
    });

    it("hasLeaderStateChangedComparedTo ignores pitch-class equivalent transposition", () => {
        const session = makeSession({ transposition: -2 });
        const equivalent = makeSession({
            transposition: 10,
            updatedAt: Timestamp.fromDate(session.updatedAt),
        });
        expect(hasLeaderStateChangedComparedTo(equivalent, session)).to.equal(false);
    });

    it("roleFromStorage maps persisted roles", () => {
        expect(roleFromStorage("leader")).to.equal("leader");
        expect(roleFromStorage("member")).to.equal("member");
        expect(roleFromStorage(null)).to.equal("none");
    });

    it("code charset has expected length", () => {
        expect(CODE_LENGTH).to.equal(6);
        expect(CODE_CHARS).to.not.include("I");
        expect(CODE_CHARS).to.not.include("O");
    });
});
