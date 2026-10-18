import { Collection } from "@/classes";
import {
    BandSyncSession,
    hasLeaderStateChangedComparedTo,
    matchesSongState,
    samePitchClass,
    toSheetApiTransposition,
} from "@/services/bandSync/bandSyncSession";
import { appSession } from "@/services/session";
import { RootState, Store } from "@/store";
import { BandSyncActionTypes } from "@/store/modules/bandSync/action-types";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { Router } from "vue-router";
import type { Store as VuexStore } from "vuex";

export type BandSyncSongCoordinatorOptions = {
    onAfterApply?: () => Promise<void>;
};

function songKey(songbookId: string, songNumber: number): string {
    return `${songbookId}:${songNumber}`;
}

export class BandSyncSongCoordinator {
    private isApplying = false;
    private lastSeenRemoteSession: BandSyncSession | null = null;
    /** Last local song identity we observed; used to detect member-initiated navigation. */
    private lastLocalSongKey: string | null = null;
    private unwatch: (() => void) | null = null;

    constructor(
        private store: Store,
        private router: Router,
        private options: BandSyncSongCoordinatorOptions = {},
    ) {}

    start(): void {
        const initial = this.getLocalState();
        this.lastLocalSongKey = songKey(initial.songbookId, initial.songNumber);

        // Store is an intersection of module-typed stores; watch() otherwise
        // narrows state to Pick<RootState, "bandSync"> and rejects songs fields.
        const rootStore = this.store as unknown as VuexStore<RootState>;
        this.unwatch = rootStore.watch(
            (state) => ({
                role: state.bandSync.role,
                syncStatus: state.bandSync.syncStatus,
                followingLeaderUpdates: state.bandSync.followingLeaderUpdates,
                code: state.bandSync.code,
                sessionTransposition: state.bandSync.session?.transposition,
                sessionSongNumber: state.bandSync.session?.songNumber,
                sessionSongbookId: state.bandSync.session?.songbookId,
                sessionUpdatedAt: state.bandSync.session?.updatedAt?.getTime(),
                collectionId: state.songs.collectionId,
                songId: state.songs.songId,
                transposition: state.songs.transposition,
                sheetMusicTransposition: state.songs.sheetMusic?.transposition,
            }),
            () => {
                const session = this.store.state.bandSync.session;
                const leaderChanged =
                    session != null &&
                    hasLeaderStateChangedComparedTo(
                        session,
                        this.lastSeenRemoteSession,
                    );

                this.onBandSyncState(leaderChanged);
                this.onLocalChange(leaderChanged);
            },
        );

        const bandSync = this.store.state.bandSync;
        const initialSession = bandSync.session;
        if (
            initialSession &&
            bandSync.role !== "none" &&
            bandSync.code != null &&
            !this.matchesLocal(initialSession)
        ) {
            const shouldCatchUp =
                bandSync.role === "leader" ||
                (bandSync.role === "member" && bandSync.followingLeaderUpdates);
            if (shouldCatchUp) {
                void this.applySession(initialSession).then((applied) => {
                    if (bandSync.role !== "member") {
                        return;
                    }
                    if (applied) {
                        this.store.dispatch(BandSyncActionTypes.MEMBER_SYNCED);
                    } else {
                        this.store.dispatch(
                            BandSyncActionTypes.SET_MEMBER_SYNC_STATUS,
                            "outOfSync",
                        );
                    }
                });
            }
        }

        const bootSession = this.store.state.bandSync.session;
        const leaderChanged =
            bootSession != null &&
            hasLeaderStateChangedComparedTo(bootSession, this.lastSeenRemoteSession);
        this.onBandSyncState(leaderChanged);
        this.onLocalChange(leaderChanged);
    }

    dispose(): void {
        this.unwatch?.();
        this.unwatch = null;
        this.lastSeenRemoteSession = null;
        this.lastLocalSongKey = null;
    }

    async resyncToLeader(): Promise<void> {
        const { role, session } = this.store.state.bandSync;
        if (!session || role !== "member") {
            return;
        }

        this.store.dispatch(
            BandSyncActionTypes.SET_FOLLOWING_LEADER_UPDATES,
            true,
        );
        const applied = await this.applySession(session);
        if (applied) {
            this.store.dispatch(BandSyncActionTypes.MEMBER_SYNCED);
        } else {
            this.store.dispatch(
                BandSyncActionTypes.SET_MEMBER_SYNC_STATUS,
                "outOfSync",
            );
        }
    }

    private getLocalState() {
        const collection = this.store.getters.collection as Collection | undefined;
        const song = collection?.songs.find(
            (s) => s.id === this.store.state.songs.songId,
        );
        const songbookId = collection?.id ?? "";
        const songNumber =
            song && collection ? song.getNumber(collection.id) ?? 0 : 0;
        const transposition = this.store.state.songs.transposition ?? 0;
        return { songbookId, songNumber, transposition, collection, song };
    }

    private rememberLocalSong(): void {
        const { songbookId, songNumber } = this.getLocalState();
        this.lastLocalSongKey = songKey(songbookId, songNumber);
    }

    private onBandSyncState(leaderChanged: boolean): void {
        const bandSync = this.store.state.bandSync;
        const isActive =
            bandSync.role !== "none" && bandSync.code != null;

        if (!isActive || !bandSync.session) {
            this.lastSeenRemoteSession = null;
            return;
        }

        if (bandSync.role === "leader") {
            this.lastSeenRemoteSession = bandSync.session;
            return;
        }

        const session = bandSync.session;

        const shouldApply =
            leaderChanged &&
            bandSync.followingLeaderUpdates &&
            !this.matchesLocal(session);

        this.lastSeenRemoteSession = session;

        if (!shouldApply) {
            return;
        }

        void this.applySession(session).then((applied) => {
            if (applied) {
                this.store.dispatch(BandSyncActionTypes.MEMBER_SYNCED);
            } else {
                this.store.dispatch(
                    BandSyncActionTypes.SET_MEMBER_SYNC_STATUS,
                    "outOfSync",
                );
            }
        });
    }

    private onLocalChange(leaderChanged: boolean): void {
        if (this.isApplying) return;

        const bandSync = this.store.state.bandSync;
        const isActive =
            bandSync.role !== "none" && bandSync.code != null;

        if (!isActive || !bandSync.session) return;

        const { songbookId, songNumber, transposition, song } = this.getLocalState();
        const localKey = songKey(songbookId, songNumber);
        const localSongChanged =
            this.lastLocalSongKey != null && this.lastLocalSongKey !== localKey;
        this.lastLocalSongKey = localKey;

        if (bandSync.role === "leader") {
            // Only publish when viewing a real song in a collection.
            if (!song || !songbookId || songNumber <= 0) {
                return;
            }

            if (
                matchesSongState(
                    bandSync.session,
                    songbookId,
                    songNumber,
                    transposition,
                )
            ) {
                return;
            }

            this.store.dispatch(BandSyncActionTypes.LEADER_PUBLISH, {
                songbookId,
                songNumber,
                transposition,
            });
            return;
        }

        if (bandSync.role === "member") {
            const inSync = matchesSongState(
                bandSync.session,
                songbookId,
                songNumber,
                transposition,
            );

            // Unfollow only when the *member* navigated away from the session
            // song. Do not treat "leader moved, we haven't applied yet" as browse-away
            // (that used to clear following after lastSeen was updated).
            if (
                localSongChanged &&
                !leaderChanged &&
                bandSync.followingLeaderUpdates &&
                !inSync
            ) {
                this.store.dispatch(
                    BandSyncActionTypes.SET_FOLLOWING_LEADER_UPDATES,
                    false,
                );
                return;
            }

            if (leaderChanged) {
                return;
            }

            this.store.dispatch(
                BandSyncActionTypes.SET_MEMBER_SYNC_STATUS,
                inSync && bandSync.followingLeaderUpdates
                    ? "inSync"
                    : "outOfSync",
            );
        }
    }

    private matchesLocal(session: BandSyncSession): boolean {
        const { songbookId, songNumber, transposition } = this.getLocalState();
        return matchesSongState(session, songbookId, songNumber, transposition);
    }

    private refreshMemberSyncStatus(): void {
        const bandSync = this.store.state.bandSync;
        if (bandSync.role !== "member" || !bandSync.session) {
            return;
        }
        const inSync = this.matchesLocal(bandSync.session);
        this.store.dispatch(
            BandSyncActionTypes.SET_MEMBER_SYNC_STATUS,
            inSync && bandSync.followingLeaderUpdates ? "inSync" : "outOfSync",
        );
    }

    /**
     * Applies remote session to local song state.
     * @returns false when the song cannot be resolved (fail closed).
     */
    private async applySession(session: BandSyncSession): Promise<boolean> {
        if (this.isApplying) {
            return false;
        }
        this.isApplying = true;

        try {
            const { songbookId, songNumber, transposition } = this.getLocalState();
            const songChanged =
                session.songbookId !== songbookId ||
                session.songNumber !== songNumber;
            const transpositionChanged = !samePitchClass(
                session.transposition,
                transposition,
            );

            if (!songChanged && !transpositionChanged) {
                return true;
            }

            if (songChanged) {
                if (session.songNumber <= 0) {
                    return false;
                }

                const col = appSession.collections.find(
                    (c) => c.id === session.songbookId,
                );
                if (!col) {
                    return false;
                }

                const language =
                    (this.store.getters.languageKey as string | undefined) ??
                    this.store.state.songs.language ??
                    "en";
                await col.load(language);

                const targetSong = col.songs.find(
                    (s) => s.getNumber(col.id) == session.songNumber,
                );
                if (!targetSong) {
                    return false;
                }

                const routeKey = String(col.key ?? col.id);

                await this.router.push({
                    name: "song",
                    params: {
                        collection: routeKey,
                        number: String(session.songNumber),
                    },
                });

                // Drive store from the session ids (not only route keys) so we
                // cannot land on the wrong book when keys are ambiguous.
                await this.store.dispatch(
                    SongsActionTypes.SELECT_COLLECTION,
                    session.songbookId,
                );
                await this.store.dispatch(
                    SongsActionTypes.SELECT_SONG,
                    session.songNumber,
                );

                const after = this.getLocalState();
                if (
                    after.songbookId !== session.songbookId ||
                    after.songNumber != session.songNumber
                ) {
                    return false;
                }
            }

            if (transpositionChanged) {
                this.store.commit(
                    SongsMutationTypes.SET_TRANSPOSITION,
                    session.transposition,
                );
            }

            // SheetMusic.vue (and any store-bound sheet) uses API-domain options.
            // SongViewer keeps a local copy; its watcher updates that separately.
            const sheetMusic = this.store.state.songs.sheetMusic;
            if (sheetMusic) {
                const userDefaultKey =
                    appSession.user?.settings?.defaultTransposition ?? "C";
                this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, {
                    ...sheetMusic,
                    transposition: toSheetApiTransposition(
                        session.transposition,
                        userDefaultKey,
                    ),
                });
            }

            if (this.options.onAfterApply) {
                await this.options.onAfterApply();
            }

            return true;
        } finally {
            this.isApplying = false;
            this.rememberLocalSong();
            this.refreshMemberSyncStatus();
        }
    }
}

export function createBandSyncSongCoordinator(
    store: Store,
    router: Router,
    options?: BandSyncSongCoordinatorOptions,
): BandSyncSongCoordinator {
    return new BandSyncSongCoordinator(store, router, options);
}
