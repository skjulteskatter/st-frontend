import { bandSyncService } from "@/services/bandSync/bandSyncService";
import {
    BandSyncException,
    BandSyncRole,
    BandSyncSession,
    BandSyncSyncStatus,
    ANOTHER_DEVICE_LEADING,
    isLedByDevice,
} from "@/services/bandSync/bandSyncSession";
import { a } from "@/services/auth";
import { ActionContext, ActionTree } from "vuex";
import type { RootState } from "../..";
import { BandSyncActionTypes } from "./action-types";
import { BandSyncMutationTypes } from "./mutation-types";
import { Mutations } from "./mutations";
import { State } from "./state";
import type { Unsubscribe } from "firebase/firestore";

const START_SESSION_TIMEOUT_MS = 15_000;
const START_SESSION_TIMEOUT_ERROR =
    "Connection timed out. Check your internet and try again.";
const START_SESSION_GENERIC_ERROR =
    "Something went wrong. Please try again.";
const SESSION_LISTENER_ERROR =
    "Lost connection to the band session. Leave and rejoin to continue syncing.";

let startSessionGeneration = 0;
let sessionUnsubscribe: Unsubscribe | null = null;

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload?: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
    dispatch<K extends keyof Actions>(
        key: K,
        payload?: Parameters<Actions[K]>[1],
    ): ReturnType<Actions[K]>;
} & Omit<ActionContext<State, RootState>, "commit" | "dispatch">;

function listenToSession(
    code: string,
    dispatch: AugmentedActionContext["dispatch"],
    commit: AugmentedActionContext["commit"],
) {
    sessionUnsubscribe?.();
    sessionUnsubscribe = bandSyncService.watchSession(
        code,
        (session) => {
            dispatch(BandSyncActionTypes.SESSION_SNAPSHOT, session);
        },
        () => {
            stopListening();
            commit(BandSyncMutationTypes.SET_ERROR, SESSION_LISTENER_ERROR);
            commit(BandSyncMutationTypes.SET_SYNC_STATUS, "outOfSync");
        },
    );
}

function stopListening() {
    sessionUnsubscribe?.();
    sessionUnsubscribe = null;
}

export interface Actions {
    [BandSyncActionTypes.INIT](context: AugmentedActionContext): Promise<void>;
    [BandSyncActionTypes.CREATE_SESSION](
        context: AugmentedActionContext,
        payload: { songbookId: string; songNumber: number; transposition: number },
    ): Promise<void>;
    [BandSyncActionTypes.JOIN_SESSION](
        context: AugmentedActionContext,
        payload: string,
    ): Promise<void>;
    [BandSyncActionTypes.CANCEL_START](context: AugmentedActionContext): void;
    [BandSyncActionTypes.LEAVE_SESSION](context: AugmentedActionContext): Promise<void>;
    [BandSyncActionTypes.RENEW_SESSION](context: AugmentedActionContext): Promise<void>;
    [BandSyncActionTypes.TAKE_LEAD](context: AugmentedActionContext): Promise<void>;
    [BandSyncActionTypes.LEADER_PUBLISH](
        context: AugmentedActionContext,
        payload: { songbookId: string; songNumber: number; transposition: number },
    ): Promise<void>;
    [BandSyncActionTypes.SET_MEMBER_SYNC_STATUS](
        context: AugmentedActionContext,
        payload: BandSyncSyncStatus,
    ): void;
    [BandSyncActionTypes.MEMBER_SYNCED](context: AugmentedActionContext): void;
    [BandSyncActionTypes.SET_FOLLOWING_LEADER_UPDATES](
        context: AugmentedActionContext,
        payload: boolean,
    ): void;
    [BandSyncActionTypes.SESSION_SNAPSHOT](
        context: AugmentedActionContext,
        payload: BandSyncSession | null,
    ): void;
    [BandSyncActionTypes.SESSION_ENDED](context: AugmentedActionContext): Promise<void>;
}

async function startSession(
    context: AugmentedActionContext,
    createOrJoin: () => Promise<BandSyncSession>,
    role: BandSyncRole,
) {
    const operationId = ++startSessionGeneration;
    context.commit(BandSyncMutationTypes.SET_PROCESSING, true);
    context.commit(BandSyncMutationTypes.SET_ERROR, null);

    try {
        const session = await Promise.race([
            createOrJoin(),
            new Promise<never>((_, reject) => {
                setTimeout(
                    () => reject(new BandSyncException(START_SESSION_TIMEOUT_ERROR)),
                    START_SESSION_TIMEOUT_MS,
                );
            }),
        ]);

        if (operationId !== startSessionGeneration) return;

        bandSyncService.savePersistedSession({
            code: session.code,
            role,
            songbookId: session.songbookId,
            followingLeaderUpdates: role === "member" ? true : undefined,
        });

        if (operationId !== startSessionGeneration) return;

        context.commit(BandSyncMutationTypes.SET_ACTIVE, {
            role,
            code: session.code,
            songbookId: session.songbookId,
            session,
            followingLeaderUpdates: role === "member" ? true : undefined,
        });

        listenToSession(session.code, context.dispatch, context.commit);
    } catch (error) {
        if (operationId !== startSessionGeneration) return;

        if (error instanceof BandSyncException) {
            context.commit(BandSyncMutationTypes.SET_ERROR, error.message);
        } else {
            context.commit(BandSyncMutationTypes.SET_ERROR, START_SESSION_GENERIC_ERROR);
        }
    }
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [BandSyncActionTypes.INIT]({ commit, dispatch }) {
        const persisted = bandSyncService.readPersistedSession();
        if (!persisted || persisted.role === "none") {
            return;
        }

        commit(BandSyncMutationTypes.SET_ACTIVE, {
            role: persisted.role,
            code: persisted.code,
            songbookId: persisted.songbookId,
            followingLeaderUpdates: persisted.followingLeaderUpdates,
        });

        listenToSession(persisted.code, dispatch, commit);

        // Re-stamp this tab's device claim so a second window with a shared
        // legacy localStorage identity cannot keep publishing as leader.
        if (persisted.role === "leader") {
            try {
                const session = await bandSyncService.claimLead({
                    code: persisted.code,
                });
                bandSyncService.savePersistedSession({
                    code: persisted.code,
                    role: "leader",
                    songbookId: session.songbookId,
                });
                commit(BandSyncMutationTypes.SET_ACTIVE, {
                    role: "leader",
                    code: persisted.code,
                    songbookId: session.songbookId,
                    session,
                });
            } catch {
                // Snapshot demotion / auth errors are handled elsewhere.
            }
        }
    },

    async [BandSyncActionTypes.CREATE_SESSION](context, payload) {
        await startSession(
            context,
            () => bandSyncService.createSession(payload),
            "leader",
        );
    },

    async [BandSyncActionTypes.JOIN_SESSION](context, code) {
        await startSession(
            context,
            () => bandSyncService.joinSession(code),
            "member",
        );
    },

    [BandSyncActionTypes.CANCEL_START]({ commit }) {
        startSessionGeneration++;
        commit(BandSyncMutationTypes.SET_PROCESSING, false);
        commit(BandSyncMutationTypes.SET_ERROR, null);
    },

    async [BandSyncActionTypes.LEAVE_SESSION]({ state, commit }) {
        stopListening();

        if (state.role === "leader" && state.code) {
            try {
                await bandSyncService.endSession({
                    code: state.code,
                });
            } catch {
                // swallow errors
            }
        }

        bandSyncService.clearPersistedSession();
        commit(BandSyncMutationTypes.RESET);
    },

    async [BandSyncActionTypes.RENEW_SESSION]({ state, commit }) {
        if (
            state.role !== "leader" ||
            !state.code ||
            !state.session
        ) {
            return;
        }

        commit(BandSyncMutationTypes.SET_PROCESSING, true);
        commit(BandSyncMutationTypes.SET_ERROR, null);

        try {
            const expireAt = await bandSyncService.renewSession({
                code: state.code,
            });

            commit(BandSyncMutationTypes.SET_SESSION, {
                ...state.session,
                expireAt,
            });
        } catch (error) {
            if (error instanceof BandSyncException) {
                commit(BandSyncMutationTypes.SET_ERROR, error.message);
            } else {
                commit(BandSyncMutationTypes.SET_ERROR, START_SESSION_GENERIC_ERROR);
            }
        } finally {
            commit(BandSyncMutationTypes.SET_PROCESSING, false);
        }
    },

    async [BandSyncActionTypes.TAKE_LEAD]({ state, commit }) {
        if (
            state.role !== "member" ||
            !state.code ||
            !state.songbookId ||
            !state.session
        ) {
            return;
        }

        const uid = a.currentUser?.uid;
        if (!uid || state.session.leaderId !== uid) {
            return;
        }

        commit(BandSyncMutationTypes.SET_PROCESSING, true);
        commit(BandSyncMutationTypes.SET_ERROR, null);

        try {
            const session = await bandSyncService.claimLead({ code: state.code });

            bandSyncService.savePersistedSession({
                code: state.code,
                role: "leader",
                songbookId: state.songbookId,
            });

            commit(BandSyncMutationTypes.SET_ACTIVE, {
                role: "leader",
                code: state.code,
                songbookId: state.songbookId,
                session,
            });
        } catch (error) {
            if (error instanceof BandSyncException) {
                commit(BandSyncMutationTypes.SET_ERROR, error.message);
            } else {
                commit(BandSyncMutationTypes.SET_ERROR, START_SESSION_GENERIC_ERROR);
            }
        } finally {
            commit(BandSyncMutationTypes.SET_PROCESSING, false);
        }
    },

    async [BandSyncActionTypes.LEADER_PUBLISH]({ state, commit }, payload) {
        if (state.role !== "leader" || !state.code) {
            return;
        }

        try {
            await bandSyncService.updateSession({
                code: state.code,
                ...payload,
            });

            if (state.session) {
                commit(BandSyncMutationTypes.SET_SESSION, {
                    ...state.session,
                    songbookId: payload.songbookId,
                    songNumber: payload.songNumber,
                    transposition: payload.transposition,
                    updatedAt: new Date(),
                });
            }
        } catch (error) {
            if (error instanceof BandSyncException) {
                // Another device claimed leadership — demote locally.
                if (
                    error.message === ANOTHER_DEVICE_LEADING &&
                    state.code &&
                    state.songbookId &&
                    state.session
                ) {
                    bandSyncService.savePersistedSession({
                        code: state.code,
                        role: "member",
                        songbookId: state.songbookId,
                        followingLeaderUpdates: true,
                    });
                    commit(BandSyncMutationTypes.SET_ACTIVE, {
                        role: "member",
                        code: state.code,
                        songbookId: state.songbookId,
                        session: state.session,
                        followingLeaderUpdates: true,
                    });
                    return;
                }
                commit(BandSyncMutationTypes.SET_ERROR, error.message);
            } else {
                commit(BandSyncMutationTypes.SET_ERROR, START_SESSION_GENERIC_ERROR);
            }
        }
    },

    [BandSyncActionTypes.SET_MEMBER_SYNC_STATUS]({ state, commit }, syncStatus) {
        if (state.role !== "member" || state.syncStatus === syncStatus) {
            return;
        }
        commit(BandSyncMutationTypes.SET_SYNC_STATUS, syncStatus);
    },

    [BandSyncActionTypes.MEMBER_SYNCED]({ state, commit }) {
        if (state.role !== "member" || state.syncStatus === "inSync") {
            return;
        }
        commit(BandSyncMutationTypes.SET_SYNC_STATUS, "inSync");
    },

    [BandSyncActionTypes.SET_FOLLOWING_LEADER_UPDATES]({ state, commit }, enabled) {
        if (state.role !== "member") {
            return;
        }

        commit(BandSyncMutationTypes.SET_FOLLOWING_LEADER_UPDATES, enabled);

        if (state.code && state.songbookId) {
            bandSyncService.savePersistedSession({
                code: state.code,
                role: "member",
                songbookId: state.songbookId,
                followingLeaderUpdates: enabled,
            });
        }

        if (!enabled) {
            commit(BandSyncMutationTypes.SET_SYNC_STATUS, "outOfSync");
        }
    },

    [BandSyncActionTypes.SESSION_SNAPSHOT]({ state, dispatch, commit }, session) {
        if (!session) {
            dispatch(BandSyncActionTypes.SESSION_ENDED);
            return;
        }

        // Another device claimed leadership — demote this install to member.
        if (state.role === "leader" && state.code) {
            const deviceId = bandSyncService.getDeviceId();
            if (!isLedByDevice(session, deviceId)) {
                bandSyncService.savePersistedSession({
                    code: state.code,
                    role: "member",
                    songbookId: session.songbookId,
                    followingLeaderUpdates: true,
                });
                commit(BandSyncMutationTypes.SET_ACTIVE, {
                    role: "member",
                    code: state.code,
                    songbookId: session.songbookId,
                    session,
                    followingLeaderUpdates: true,
                });
                return;
            }
        }

        commit(BandSyncMutationTypes.SET_SESSION, session);
    },

    async [BandSyncActionTypes.SESSION_ENDED]({ commit }) {
        stopListening();
        bandSyncService.clearPersistedSession();
        commit(BandSyncMutationTypes.RESET);
    },
};

export function resetBandSyncStartGenerationForTests(): void {
    startSessionGeneration = 0;
}
