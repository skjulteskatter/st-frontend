import {
    BandSyncRole,
    BandSyncSession,
    BandSyncSyncStatus,
} from "@/services/bandSync/bandSyncSession";
import { MutationTree } from "vuex";
import { State } from ".";
import { BandSyncMutationTypes } from "./mutation-types";

export type ActivePayload = {
    role: BandSyncRole;
    code: string;
    songbookId: string;
    session?: BandSyncSession | null;
    /** When set for members, restores persisted follow preference. */
    followingLeaderUpdates?: boolean;
};

export type Mutations<S = State> = {
    [BandSyncMutationTypes.RESET](state: S): void;
    [BandSyncMutationTypes.SET_ACTIVE](state: S, payload: ActivePayload): void;
    [BandSyncMutationTypes.SET_SESSION](state: S, payload: BandSyncSession | null): void;
    [BandSyncMutationTypes.SET_PROCESSING](state: S, payload: boolean): void;
    [BandSyncMutationTypes.SET_ERROR](state: S, payload: string | null): void;
    [BandSyncMutationTypes.SET_SYNC_STATUS](state: S, payload: BandSyncSyncStatus): void;
    [BandSyncMutationTypes.SET_FOLLOWING_LEADER_UPDATES](state: S, payload: boolean): void;
};

export const mutations: MutationTree<State> & Mutations = {
    [BandSyncMutationTypes.RESET](state) {
        state.role = "none";
        state.syncStatus = "inSync";
        state.followingLeaderUpdates = true;
        state.code = null;
        state.songbookId = null;
        state.session = null;
        state.isProcessing = false;
        state.errorMessage = null;
    },
    [BandSyncMutationTypes.SET_ACTIVE](state, payload) {
        state.role = payload.role;
        const followingLeaderUpdates =
            payload.role === "member"
                ? payload.followingLeaderUpdates !== false
                : true;
        state.followingLeaderUpdates = followingLeaderUpdates;
        state.syncStatus =
            payload.role === "member" && !followingLeaderUpdates
                ? "outOfSync"
                : "inSync";
        state.code = payload.code;
        state.songbookId = payload.songbookId;
        state.session = payload.session ?? null;
        state.isProcessing = false;
        state.errorMessage = null;
    },
    [BandSyncMutationTypes.SET_SESSION](state, session) {
        state.session = session;
    },
    [BandSyncMutationTypes.SET_PROCESSING](state, isProcessing) {
        state.isProcessing = isProcessing;
    },
    [BandSyncMutationTypes.SET_ERROR](state, errorMessage) {
        state.errorMessage = errorMessage;
        state.isProcessing = false;
    },
    [BandSyncMutationTypes.SET_SYNC_STATUS](state, syncStatus) {
        state.syncStatus = syncStatus;
    },
    [BandSyncMutationTypes.SET_FOLLOWING_LEADER_UPDATES](state, followingLeaderUpdates) {
        state.followingLeaderUpdates = followingLeaderUpdates;
    },
};
