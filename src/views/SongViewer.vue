<template>
    <loader :loading="loading">
        <div v-if="!loading && initialized && song" class="song-viewer">
            <div class="song-viewer__content">
                <div class="song-viewer__header">
                    <back-button />
                    <div class="song-viewer__header__buttons">
                        <modal
                            theme="secondary"
                            icon="folder"
                            :label="$t('playlist.addtoplaylist')"
                        >
                            <h3 style="margin-top: 0">
                                {{ $t("common.playlists") }}
                            </h3>
                            <base-button
                                class="song-viewer__playlist"
                                v-for="playlist in playlists"
                                :key="playlist.id"
                                @click="addToPlaylist(playlist)"
                                :loading="componentLoading[playlist.id]"
                            >
                                {{ playlist.name }}
                                <small>{{ playlist.entries.length }}</small>
                            </base-button>
                        </modal>
                        <!-- <div
                            v-for="tag in tags"
                            :key="tag.id"
                        >
                            {{tag.name}}
                        </div>
                        <base-dropdown
                            label="tags"
                        >
                            <base-button
                                v-for="tag in allTags"
                                :key="tag.id"
                                @click="addToTag(tag)"
                            >
                                {{ tag.name }}
                            </base-button>
                        </base-dropdown> -->
                        <!-- <base-dropdown
                            theme="tertiary"
                            icon="book"
                            :label="$t('song.sheetmusic')"
                            v-if="song.sheetMusic.length"
                        >
                            <h3 style="margin-top: 0">
                                {{ $t("song.sheetmusic") }}
                            </h3>
                            <base-button
                                v-for="sheet in song.sheetMusic"
                                :key="sheet.id"
                                @click="sheetMusic(sheet)"
                            >
                                {{ $t(`types.${sheet.category}`) }}
                            </base-button>
                        </base-dropdown> -->
                        <base-button
                            v-if="extended"
                            @click="extend"
                            icon="screen"
                            class="song-viewer__sidebar__buttons--advanced"
                        >
                            {{ $t("song.viewer") }}
                        </base-button>
                    </div>
                </div>
                <div class="song-viewer__metadata">
                    <song-info-card
                        :song="song"
                        :languageKey="languageKey"
                    ></song-info-card>
                    <song-files-card :song="song"></song-files-card>
                    <lyrics-settings
                        v-if="isExtended"
                        :languageKey="languageKey"
                        :lyrics="lyrics"
                        :song="song"
                    ></lyrics-settings>
                </div>
                <lyrics-card
                    v-if="song.hasLyrics"
                    :song="song"
                    :lyrics="lyrics"
                    :collection="collection"
                >
                </lyrics-card>
            </div>
        </div>
    </loader>
</template>
<script lang="ts">
import { SongInfoCard, SongFilesCard } from "@/components/songs";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import { Options, Vue } from "vue-class-component";
import {
    LyricsSettings,
    LyricsCard,
    BaseButton,
    BaseCard,
    BackButton,
    Modal,
    Loader,
} from "@/components";
import { BaseDropdown } from "@/components/inputs";
import { Collection, Lyrics } from "@/classes";
// import { osmd } from "@/services/osmd";
import { ApiPlaylist, ApiTag, MediaFile } from "dmb-api";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

@Options({
    components: {
        LyricsSettings,
        LyricsCard,
        BaseButton,
        SongInfoCard,
        SongFilesCard,
        BaseCard,
        BaseDropdown,
        BackButton,
        OpenSheetMusicDisplay,
        Modal,
        Loader,
    },
    name: "song-viewer",
})
export default class SongViewer extends Vue {
    public store = useStore();
    public number = 0;
    public selectedLanguage = this.languageKey;
    public sidebar = false;
    public selectedSheetMusic?: MediaFile = {} as MediaFile;
    public lyricsLoading = true;

    public componentLoading: {
        [key: string]: boolean;
    } = {};

    // public unmounted() {
    //     this.songStore.commit("sheetMusic", {show: false});
    // }

    public async mounted() {
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, {
            show: false,
        });
        this.number = parseInt(this.$route.params.number as string);
        if (
            !this.store.getters.collection
                ?.getKeys()
                .includes(this.$route.params.collection as string)
        ) {
            await this.store.dispatch(
                SongsActionTypes.SELECT_COLLECTION,
                this.$route.params.collection as string
            );
        }

        while (this.collection?.loading) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await this.store.dispatch(SongsActionTypes.SELECT_SONG, this.number);
        this.store.commit(SongsMutationTypes.SET_SONG_NUMBER, this.number);

        const route = this.$route.fullPath;
        const log = () => {
            if (route == this.$route.fullPath && this.song) {
                this.store.dispatch(
                    SessionActionTypes.LOG_SONG_ITEM,
                    this.song
                );
            }
        };
        setTimeout(log, 5000);
        this.lyricsLoading = false;
    }

    public sheetMusic(sheet: MediaFile) {
        // this.$router.push({name: "songs-sheet-music"});
        // osmd.load(this.songStore.state.sheetMusic);
        const options: SheetMusicOptions = {
            show: true,
            url: sheet?.directUrl,
            originalKey: this.song?.originalKey,
            transposition: this.transposition,
            type: sheet?.type,
        };

        localStorage.setItem("song_item", JSON.stringify(this.song));
        localStorage.setItem("sheetmusic_options", JSON.stringify(options));

        window.open("/sheetmusic", "Sheet Music", "resizeable,scrollbars");
    }

    public async addToPlaylist(playlist: ApiPlaylist) {
        // Add song to playlist with ID
        const song = this.song;

        if (song) {
            if (
                playlist.entries.find(
                    (e) => e.type == "song" && e.itemId == song.id
                )
            ) {
                if (!confirm("Song is already in playlist. Add duplicate?"))
                    return;
            }

            this.componentLoading[playlist.id] = true;
            await this.store.dispatch(SessionActionTypes.PLAYLIST_ADD_SONG, {
                playlistId: playlist.id,
                songId: song.id,
            });
            this.componentLoading[playlist.id] = false;

            this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
                type: "success",
                title: "Added to playlist",
                content: `Added "${song.getName(
                    this.languageKey
                )}" to playlist ${playlist.name}`,
                icon: "check",
            });
        }
    }

    public async addToTag(tag: ApiTag) {
        const song = this.song;
        if (song) {
            if (tag.songIds.includes(song.id)) {
                return;
            }

            this.componentLoading[tag.id] = true;
            await this.store.dispatch(SessionActionTypes.TAGS_ADD_SONG, {
                tagId: tag.id,
                songId: song.id,
            });
            this.componentLoading[tag.id] = false;

            this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
                type: "success",
                title: "Tagged song",
                content: `Tagged "${song.getName(this.languageKey)}" with ${
                    tag.name
                }`,
                icon: "check",
            });
        }
    }

    public async createTag(name: string) {
        const song = this.song;

        if (song) {
            await this.store.dispatch(SessionActionTypes.TAGS_CREATE, {
                name,
                songId: song.id,
                color: "#cccccc",
            });
        }
    }

    public get playlists() {
        return this.store.state.session.playlists;
    }

    public get leadSheet() {
        return this.song?.sheetMusic?.find((s) => s.category === "leadsheet");
    }

    public get transposition() {
        return this.store.state.songs.smTransposition;
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public get isExtended() {
        return this.store.state.session.extend;
    }

    public get loading() {
        return this.store.getters.collection?.loading === true;
    }

    public get loadingLyrics() {
        return this.collection?.loadingLyrics === true;
    }

    public extend() {
        this.store.commit(SessionMutationTypes.EXTEND, !this.isExtended);
    }

    public get lyrics(): Lyrics | undefined {
        return this.store.getters.lyrics;
    }

    public get song() {
        return this.store.getters.song;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get initialized() {
        return this.store.getters.initialized;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }

    public get tags() {
        return this.store.state.session.tags.filter((t) =>
            t.songIds.includes(this.song?.id ?? "")
        );
    }

    public get allTags() {
        return this.store.state.session.tags.filter(
            (t) => !t.songIds.includes(this.song?.id ?? "")
        );
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

// ::-webkit-scrollbar {
//     display: none;
// }

.song-viewer {
    display: flex;
    height: 100%;

    .sheetmusic {
        width: 100%;
        height: 80%;
        border: none;
    }

    &__playlist {
        width: 100%;
        margin-top: 0;
        padding: 0.5em;
        border: 1px solid var(--st-color-border);
        border-radius: var(--st-border-radius);
        cursor: pointer;
    }

    &__header {
        display: flex;
        justify-content: space-between;

        @include breakpoint("small") {
            flex-direction: column;
        }

        &__buttons {
            display: flex;
            align-items: center;
            gap: calc(var(--st-spacing) / 2);

            @include breakpoint("small") {
                justify-content: flex-end;

                > button .button__content {
                    display: none;
                }

                .modal > button .button__content {
                    display: none;
                }
            }
        }
    }

    &__metadata {
        display: flex;
        gap: var(--st-spacing);

        @include breakpoint("medium") {
            flex-direction: column;
        }
    }

    &__content {
        flex-grow: 1;
        flex-wrap: wrap;
        gap: var(--st-spacing);
        padding: calc(var(--st-spacing) * 2);
        //overflow-y: auto;

        @include breakpoint("medium") {
            padding: var(--st-spacing);
            //overflow-y: scroll;
        }

        & > *:not(:last-child) {
            margin-bottom: var(--st-spacing);
        }
    }

    &__sidebar {
        min-width: 350px;
        max-height: 100vh;
        position: sticky;
        top: 0;
        padding: var(--st-spacing);
        background-color: var(--st-color-background-light);
        border-left: 1px solid var(--st-color-border);
        animation: slideInFromRight 0.5s;

        overflow-y: auto;

        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);

        @include breakpoint("small") {
            border-top: 1px solid var(--st-color-border);
            position: fixed;
            top: auto;
            bottom: 0;
            min-width: 0;
            width: 100%;
            overflow-y: scroll;

            .song-viewer__sidebar__buttons--advanced {
                display: none;
            }
        }

        &__content {
            display: flex;
            flex-direction: column;
            gap: var(--st-spacing);
            overflow-y: auto;
            flex-grow: 1;

            @include breakpoint("small") {
                overflow-y: scroll;
            }
        }

        &__buttons {
            display: flex;
            gap: calc(var(--st-spacing) / 2);
        }

        .language-dropdown {
            &__item {
                cursor: pointer;

                &:hover {
                    color: var(--st-color-primary);
                }
            }
        }
    }
}
</style>
