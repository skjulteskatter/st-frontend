<template>
    <loader :loading="loading">
        <div v-if="song" class="flex flex-col gap-4 p-4 md:p-8">
            <div class="flex justify-between">
                <back-button />
                <div class="flex gap-2 items-center">
                    <router-link :to="{ name: 'song-stats', params: { id: song.id } }" class="p-2 border border-gray-400 rounded text-gray-500 text-sm">See statistics</router-link>
                    <base-button
                        v-if="admin"
                        @click="goToEditPage()"
                        theme="tertiary"
                        icon="pencil"
                        class="mr-4"
                    >Edit</base-button>
                    <modal
                        class="playlist-adder"
                        theme="secondary"
                        icon="folder"
                        :label="$t('playlist.addtoplaylist')"
                        v-if="playlists.length"
                    >
                        <h3 class="mt-0 font-bold mb-4">
                            {{ $t("common.playlists") }}
                        </h3>
                        <div class="flex flex-col gap-2">
                            <playlist-card
                                v-for="playlist in playlists"
                                :key="playlist.id"
                                :playlist="playlist"
                                @click="addToPlaylist(playlist)"
                            />
                        </div>
                    </modal>
                    <base-button
                        v-if="song.hasLyrics"
                        @click="extend"
                        icon="screen"
                        :disabled="lyrics?.format != 'json'"
                        class="viewer-button"
                    >
                        {{ $t("song.viewer") }}
                    </base-button>
                </div>
            </div>
            <div class="flex gap-2 flex-wrap">
                <song-tags :song="song" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <song-info-card
                    :song="song"
                    :languageKey="languageKey"
                    :viewCount="viewCount"
                    class="md:col-span-2"
                />
                <song-media-card 
                    :song="song"
                />
                <lyrics-settings
                    v-if="isExtended"
                    :languageKey="languageKey"
                    :lyrics="lyrics"
                    :song="song"
                />
            </div>
            <lyrics-card
                :style="sheetMusicOptions?.show ? 'display: none;' : ''"
                v-if="song.hasLyrics"
                :song="song"
                :lyrics="lyrics"
                :collection="collection"
            />
        </div>
    </loader>
</template>
<script lang="ts">
import { SongInfoCard, SongMediaCard, SongTags } from "@/components/songs";
import { Options, Vue } from "vue-class-component";
import {
    LyricsSettings,
    LyricsCard,
    BackButton,
    Modal,
} from "@/components";
import { PlaylistCard } from "@/components/playlist";
import { Collection } from "@/classes";
// import { osmd } from "@/services/osmd";
import { ApiPlaylist, MediaFile } from "dmb-api";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { notify } from "@/services/notify";
import { analytics } from "@/services/api";

@Options({
    components: {
        LyricsSettings,
        LyricsCard,
        SongInfoCard,
        SongMediaCard,
        SongTags,
        BackButton,
        Modal,
        PlaylistCard,
    },
    name: "song-viewer",
})
export default class SongViewer extends Vue {
    private store = useStore();
    public number = 0;
    public selectedLanguage = this.languageKey;
    public sidebar = false;
    public selectedSheetMusic?: MediaFile = {} as MediaFile;
    public lyricsLoading = true;
    public viewCount = 0;

    public componentLoading: {
        [key: string]: boolean;
    } = {};

    // public unmounted() {
    //     this.songStore.commit("sheetMusic", {show: false});
    // }

    public async beforeMount() {
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, {
            show: false,
            loaded: false,
            originalKey: "C",
        });
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, undefined);
        this.number = parseInt(this.$route.params.number as string);
        if (
            !this.store.getters.collection
                ?.getKeys()
                .includes(this.$route.params.collection as string)
        ) {
            await this.store.dispatch(
                SongsActionTypes.SELECT_COLLECTION,
                this.$route.params.collection as string,
            );
        }

        while (this.collection?.loading) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await this.store.dispatch(SongsActionTypes.SELECT_SONG, this.number);
        this.store.commit(SongsMutationTypes.SET_SONG_NUMBER, this.number);

        if (this.song?.hasLyrics && this.collection)
        {
            if (this.store.state.songs.view == "transpose") {
                await this.collection?.transposeLyrics(
                    this.song.collections.find(s => s.id == this.collection?.id)?.number ?? 0, 
                    this.store.state.songs.transposition ?? 0,
                    this.languageKey,
                );
                // console.log(l);
            }
            else {
                await this.collection?.getLyrics(this.song, this.store.state.songs.language);
            }
                
        }

        try {
            if (this.song?.id) {
                this.viewCount = await analytics.getViewsForSong(this.song.id);
            }
        }
        catch (e) {
            //
        }

        const route = this.$route.fullPath;
        const log = () => {
            if (route == this.$route.fullPath && this.song) {
                this.store.dispatch(
                    SessionActionTypes.LOG_SONG_ITEM,
                    this.song,
                );
            }
        };
        setTimeout(log, 5000);
        this.lyricsLoading = false;
    }

    public get admin() {
        return this.store.state.session.currentUser?.roles.includes("administrator");
    }

    public get lyrics() {
        return this.store.getters.lyrics;
    }

    public get view() {
        return this.store.state.songs.view;
    }

    public get sheetMusicOptions(): SheetMusicOptions | undefined {
        return this.store.state.songs.sheetMusic;
    }

    public getAnalytics() {
        return analytics.getForSong(this.song?.id as string);
    }

    // public sheetMusic(sheet: MediaFile) {
    //     // this.$router.push({name: "songs-sheet-music"});
    //     // osmd.load(this.songStore.state.sheetMusic);
    //     const options: SheetMusicOptions = {
    //         show: true,
    //         url: sheet?.directUrl,
    //         originalKey: this.song?.originalKey,
    //         transposition: transposer.getRelativeTransposition(
    //             this.store.getters.user?.settings?.defaultTransposition ?? "C",
    //             true
    //         ),
    //         type: sheet?.type,
    //     };

    //     localStorage.setItem("song_item", JSON.stringify(this.song));
    //     localStorage.setItem("sheetmusic_options", JSON.stringify(options));

    //     window.open("/sheetmusic", "Sheet Music", "resizeable,scrollbars");
    // }

    public async addToPlaylist(playlist: ApiPlaylist) {
        // Add song to playlist with ID
        const song = this.song;

        if (song) {
            if (
                playlist.entries.find(
                    (e) => e.type == "song" && e.songId == song.id,
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

            notify("success", "Added to playlist",  "check", `Added "${song.getName(this.languageKey)}" to playlist ${playlist.name}`);
        }
    }

    public goToEditPage() {
        window.open(`https://songtreasures.sanity.studio/desk/select-songs;${this.collection?.id};${this.song?.id}`);
    }

    public get playlists() {
        return this.store.state.session.playlists;
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public get isExtended() {
        return this.store.state.session.extend;
    }

    public get loading() {
        return this.collection?.loading === true;
    }

    public get loadingLyrics() {
        return this.collection?.loadingLyrics === true;
    }

    public extend() {
        this.store.commit(SessionMutationTypes.EXTEND, !this.isExtended);
    }

    public get song() {
        return this.store.getters.song;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.viewer-button, 
.playlist-adder {
    @include breakpoint("medium") {
        .button__content {
            display: none;
        }
    }
}
</style>
