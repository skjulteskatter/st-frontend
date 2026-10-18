import { expect } from "chai";
import sinon from "sinon";
import { createStore } from "vuex";
import { store as bandSyncModule, resetBandSyncStartGenerationForTests } from "@/store/modules/bandSync";
import { BandSyncActionTypes } from "@/store/modules/bandSync/action-types";
import { BandSyncMutationTypes } from "@/store/modules/bandSync/mutation-types";
import { BandSyncException, ANOTHER_DEVICE_LEADING } from "@/services/bandSync/bandSyncSession";
import { bandSyncService } from "@/services/bandSync/bandSyncService";
import { a } from "@/services/auth";

const mockSession = {
    sessionId: "ABC123",
    code: "ABC123",
    leaderId: "leader-1",
    songbookId: "book-1",
    songNumber: 10,
    transposition: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    expireAt: new Date(Date.now() + 86400000),
};

function createBandSyncStore() {
    return createStore({
        modules: {
            bandSync: bandSyncModule,
        },
    });
}

describe("bandSync actions", () => {
    beforeEach(() => {
        resetBandSyncStartGenerationForTests();
        sinon.stub(bandSyncService, "watchSession").returns(() => undefined);
        sinon.stub(bandSyncService, "readPersistedSession").returns(null);
        sinon.stub(bandSyncService, "savePersistedSession");
        sinon.stub(bandSyncService, "clearPersistedSession");
    });

    afterEach(() => {
        sinon.restore();
    });

    it("createSession sets active state on success", async () => {
        sinon.stub(bandSyncService, "createSession").resolves(mockSession);
        const store = createBandSyncStore();

        await store.dispatch(BandSyncActionTypes.CREATE_SESSION, {
            songbookId: "book-1",
            songNumber: 10,
            transposition: 0,
        });

        expect(store.state.bandSync.role).to.equal("leader");
        expect(store.state.bandSync.code).to.equal("ABC123");
        expect((bandSyncService.savePersistedSession as sinon.SinonStub).called).to.equal(true);
    });

    it("cancelStart clears processing and error state", () => {
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_PROCESSING, true);
        store.commit(BandSyncMutationTypes.SET_ERROR, "Session not found.");

        store.dispatch(BandSyncActionTypes.CANCEL_START);

        expect(store.state.bandSync.isProcessing).to.equal(false);
        expect(store.state.bandSync.errorMessage).to.equal(null);
    });

    it("createSession surfaces timeout error message", async () => {
        const clock = sinon.useFakeTimers();
        try {
            sinon.stub(bandSyncService, "createSession").callsFake(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => resolve(mockSession), 20_000);
                    }),
            );

            const store = createBandSyncStore();
            const dispatchPromise = store.dispatch(BandSyncActionTypes.CREATE_SESSION, {
                songbookId: "book-1",
                songNumber: 10,
                transposition: 0,
            });

            await clock.tickAsync(15_000);
            await dispatchPromise;

            expect(store.state.bandSync.errorMessage).to.equal(
                "Connection timed out. Check your internet and try again.",
            );
        } finally {
            clock.restore();
        }
    });

    it("session snapshot null ends session", async () => {
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "member",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        await store.dispatch(BandSyncActionTypes.SESSION_SNAPSHOT, null);

        expect(store.state.bandSync.role).to.equal("none");
        expect((bandSyncService.clearPersistedSession as sinon.SinonStub).called).to.equal(true);
    });

    it("joinSession surfaces BandSyncException message", async () => {
        sinon.stub(bandSyncService, "joinSession").rejects(
            new BandSyncException("Session not found."),
        );
        const store = createBandSyncStore();

        await store.dispatch(BandSyncActionTypes.JOIN_SESSION, "BADCODE");

        expect(store.state.bandSync.errorMessage).to.equal("Session not found.");
    });

    it("renewSession is leader-only", async () => {
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "member",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        const renewStub = sinon.stub(bandSyncService, "renewSession");
        await store.dispatch(BandSyncActionTypes.RENEW_SESSION);

        expect(renewStub.called).to.equal(false);
    });

    it("renewSession updates session expireAt on success", async () => {
        const newExpireAt = new Date(Date.now() + 864000000);
        sinon.stub(bandSyncService, "renewSession").resolves(newExpireAt);
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "leader",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        await store.dispatch(BandSyncActionTypes.RENEW_SESSION);

        expect(store.state.bandSync.session?.expireAt.getTime()).to.equal(
            newExpireAt.getTime(),
        );
        expect(store.state.bandSync.isProcessing).to.equal(false);
        expect(store.state.bandSync.errorMessage).to.equal(null);
    });

    it("renewSession surfaces BandSyncException message", async () => {
        sinon.stub(bandSyncService, "renewSession").rejects(
            new BandSyncException("Leader must be logged in."),
        );
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "leader",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        await store.dispatch(BandSyncActionTypes.RENEW_SESSION);

        expect(store.state.bandSync.errorMessage).to.equal("Leader must be logged in.");
        expect(store.state.bandSync.isProcessing).to.equal(false);
    });

    it("leaderPublish surfaces generic error for non-BandSyncException", async () => {
        sinon.stub(bandSyncService, "updateSession").rejects(new Error("firestore down"));
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "leader",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        await store.dispatch(BandSyncActionTypes.LEADER_PUBLISH, {
            songbookId: "book-1",
            songNumber: 11,
            transposition: 1,
        });

        expect(store.state.bandSync.errorMessage).to.equal(
            "Something went wrong. Please try again.",
        );
    });

    it("setFollowingLeaderUpdates persists preference for members", () => {
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "member",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        store.dispatch(BandSyncActionTypes.SET_FOLLOWING_LEADER_UPDATES, false);

        expect(store.state.bandSync.followingLeaderUpdates).to.equal(false);
        expect(store.state.bandSync.syncStatus).to.equal("outOfSync");
        expect(
            (bandSyncService.savePersistedSession as sinon.SinonStub).calledWith(
                sinon.match({
                    code: "ABC123",
                    role: "member",
                    songbookId: "book-1",
                    followingLeaderUpdates: false,
                }),
            ),
        ).to.equal(true);
    });

    it("init restores followingLeaderUpdates false from persistence", () => {
        (bandSyncService.readPersistedSession as sinon.SinonStub).returns({
            code: "ABC123",
            role: "member",
            songbookId: "book-1",
            followingLeaderUpdates: false,
        });

        const store = createBandSyncStore();
        store.dispatch(BandSyncActionTypes.INIT);

        expect(store.state.bandSync.role).to.equal("member");
        expect(store.state.bandSync.followingLeaderUpdates).to.equal(false);
        expect(store.state.bandSync.syncStatus).to.equal("outOfSync");
    });

    it("setActive defaults member following to true when omitted", () => {
        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "member",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        expect(store.state.bandSync.followingLeaderUpdates).to.equal(true);
        expect(store.state.bandSync.syncStatus).to.equal("inSync");
    });

    it("takeLead claims lead via service and switches to leader", async () => {
        const originalDescriptor = Object.getOwnPropertyDescriptor(
            a,
            "currentUser",
        );
        Object.defineProperty(a, "currentUser", {
            configurable: true,
            get: () => ({ uid: "leader-1" }),
        });

        const claimed = {
            ...mockSession,
            leaderDeviceId: "this-device",
            updatedAt: new Date(),
        };
        sinon.stub(bandSyncService, "claimLead").resolves(claimed);

        try {
            const store = createBandSyncStore();
            store.commit(BandSyncMutationTypes.SET_ACTIVE, {
                role: "member",
                code: "ABC123",
                songbookId: "book-1",
                session: mockSession,
            });

            await store.dispatch(BandSyncActionTypes.TAKE_LEAD);

            expect(
                (bandSyncService.claimLead as sinon.SinonStub).calledWith({
                    code: "ABC123",
                }),
            ).to.equal(true);
            expect(store.state.bandSync.role).to.equal("leader");
            expect(store.state.bandSync.session?.leaderDeviceId).to.equal(
                "this-device",
            );
            expect(
                (bandSyncService.savePersistedSession as sinon.SinonStub).calledWith(
                    sinon.match({
                        code: "ABC123",
                        role: "leader",
                        songbookId: "book-1",
                    }),
                ),
            ).to.equal(true);
        } finally {
            if (originalDescriptor) {
                Object.defineProperty(a, "currentUser", originalDescriptor);
            } else {
                Object.defineProperty(a, "currentUser", {
                    configurable: true,
                    get: () => null,
                });
            }
        }
    });

    it("session snapshot demotes leader when another device claimed lead", async () => {
        sinon.stub(bandSyncService, "getDeviceId").returns("device-a");

        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "leader",
            code: "ABC123",
            songbookId: "book-1",
            session: { ...mockSession, leaderDeviceId: "device-a" },
        });

        await store.dispatch(BandSyncActionTypes.SESSION_SNAPSHOT, {
            ...mockSession,
            leaderDeviceId: "device-b",
            songbookId: "book-2",
        });

        expect(store.state.bandSync.role).to.equal("member");
        expect(store.state.bandSync.followingLeaderUpdates).to.equal(true);
        expect(store.state.bandSync.songbookId).to.equal("book-2");
        expect(
            (bandSyncService.savePersistedSession as sinon.SinonStub).calledWith(
                sinon.match({
                    code: "ABC123",
                    role: "member",
                    songbookId: "book-2",
                    followingLeaderUpdates: true,
                }),
            ),
        ).to.equal(true);
    });

    it("init as leader re-claims device ownership", async () => {
        (bandSyncService.readPersistedSession as sinon.SinonStub).returns({
            code: "ABC123",
            role: "leader",
            songbookId: "book-1",
        });
        const claimed = {
            ...mockSession,
            leaderDeviceId: "this-tab",
        };
        sinon.stub(bandSyncService, "claimLead").resolves(claimed);

        const store = createBandSyncStore();
        await store.dispatch(BandSyncActionTypes.INIT);

        expect(store.state.bandSync.role).to.equal("leader");
        expect(
            (bandSyncService.claimLead as sinon.SinonStub).calledWith({
                code: "ABC123",
            }),
        ).to.equal(true);
        expect(store.state.bandSync.session?.leaderDeviceId).to.equal("this-tab");
    });

    it("leader publish demotes when another device is leading", async () => {
        sinon
            .stub(bandSyncService, "updateSession")
            .rejects(new BandSyncException(ANOTHER_DEVICE_LEADING));

        const store = createBandSyncStore();
        store.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: "leader",
            code: "ABC123",
            songbookId: "book-1",
            session: mockSession,
        });

        await store.dispatch(BandSyncActionTypes.LEADER_PUBLISH, {
            songbookId: "book-1",
            songNumber: 11,
            transposition: 0,
        });

        expect(store.state.bandSync.role).to.equal("member");
        expect(store.state.bandSync.followingLeaderUpdates).to.equal(true);
        expect(store.state.bandSync.errorMessage).to.equal(null);
    });
});
