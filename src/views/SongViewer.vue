<template>
    <loader :loading="loading">
        <div v-if="song" class="flex flex-col gap-4">
            <div class="flex justify-between">
                <back-button />
                <div class="flex gap-2 items-center ml-auto">
                    <span v-if="isAdmin" class="text-sm text-gray-400 border border-gray-400 p-2 rounded-md hidden xl:block">{{ song.id }}</span>
                    <base-button
                        v-if="isAdmin"
                        @click="goToEditPage()"
                        theme="tertiary"
                        class="mr-4 hidden lg:flex"
                    >
                        <template #icon>
                            <PencilAltIcon class="w-4 h-4" />
                        </template>
                        {{ $t('common.edit') }}
                    </base-button>
                    <base-button theme="secondary" @click="openAdder()" v-if="playlists.length" class="playlist-adder">
                        <template #icon>
                            <FolderAddIcon class="w-4 h-4" />
                        </template>
                        {{ $t('common.addTo') + ' ' + $t('common.collection').toLowerCase() }}
                    </base-button>
                    <base-modal :show="show" @close="closeAdder()">
                        <template #title>
                            <h3 class="font-bold">
                                {{ $t('common.select') }} {{ $t("common.collection").toLocaleLowerCase() }}
                            </h3>
                        </template>
                        <div class="flex flex-col gap-2 max-h-72 w-96 overflow-y-auto">
                            <playlist-card
                                v-for="playlist in playlists"
                                :key="playlist.id"
                                :playlist="playlist"
                                @click="addToPlaylist(playlist)"
                            />
                        </div>
                    </base-modal>
                    <SwitchGroup as="div" class="hidden md:flex flex-col gap-1 cursor-pointer" v-if="song?.hasLyrics">
                        <SwitchLabel class="text-xs tracking-wide">{{ $t("song.viewer") }}</SwitchLabel>
                        <Switch
                            :disabled="view == 'transpose'"
                            @click="extend()"
                            v-model="switchExtended"
                            class="focus:outline-none"
                            :class="{ 'opacity-50 cursor-not-allowed': view == 'transpose' }"
                        >
                            <div
                                class="relative inline-flex items-center h-6 rounded-full w-10 transition-colors"
                                :class="switchExtended ? 'bg-primary' : 'bg-black/20 dark:bg-white/40'"
                            >
                                <span
                                    :class="switchExtended ? 'translate-x-5' : 'translate-x-1'"
                                    class="shadow-md inline-block w-4 h-4 transform bg-white rounded-full transition-transform dark:bg-secondary"
                                />
                            </div>
                        </Switch>
                    </SwitchGroup>
                </div>
            </div>
            <song-tags :song="song" />
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="flex flex-col gap-4 md:col-span-2">
                    <song-info-card
                        :song="song"
                        :languageKey="languageKey"
                        :viewCount="viewCount"
                        class="md:col-span-2"
                    />
                    <lyrics-card
                        :class="{ 'hidden': sheetMusicOptions?.show }"
                        v-if="song.hasLyrics && !isExtended"
                        :song="song"
                        :lyrics="lyrics"
                        :collection="collection"
                    />
                    <presentation-preview
                        v-if="song.hasLyrics && isExtended && lyrics"
                        :text="lyrics?.getText({
                            chorus: this.$t('song.chorus'),
                            bridge: this.$t('song.bridge'),
                        }, true) ?? []"
                        :availableVerses="control.AvailableVerses"
                        :currentVerses="control.currentVerses"
                        @mounted="setLyrics"
                        @toggleAll="toggleAll()"
                        @toggle="toggleVerse"
                    />
                </div>
                <aside>
                    <song-media-card
                        v-if="!isExtended"
                        :song="song"
                        :lyrics="lyrics ?? undefined"
                        :languageKey="languageKey ?? undefined"
                        class="sticky top-20"
                    />
                    <div v-else class="sticky top-20 flex flex-col gap-4">
                        <presentation-control-panel
                            @refresh="refresh()"
                            @next="next()"
                            @previous="previous()"
                            @mute="control.mute()"
                        />
                        <theme-selector :theme="control.Settings?.theme" @setTheme="setTheme" />
                        <song-selector :songs="collection?.songs" @setSong="setSong" />
                    </div>
                </aside>
            </div>
        </div>
    </loader>
    <base-modal :show="song ? !song.available : false">
        <div class="flex flex-col items-center">
            <LockClosedIcon class="w-10 h-10 text-primary my-4" />
            <h2 class="text-2xl font-bold">{{ $t('store.limitedAccess') }}</h2>
            <p class="text-center">{{ $t('store.gainAccess') }}</p>
            <div class="p-2 rounded-md border border-gray-300 mt-4 flex items-center gap-4" v-if="collection">
                <img class="max-h-12 rounded" :src="collection.image" :alt="collection.getName(languageKey)">
                <p>{{ collection.getName(languageKey) }}</p>
            </div>
            <div class="flex gap-4 mt-8">
                <base-button theme="tertiary" @click="$router.back()">
                    <template #icon>
                        <ArrowLeftIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common.back') }}
                </base-button>
                <base-button theme="secondary" @click="addToCart">
                    <template #icon>
                        <ShoppingCartIcon class="w-4 h-4" />
                    </template>
                    {{ $t('store.addToCart') }}
                </base-button>
            </div>
        </div>
    </base-modal>
</template>
<script lang="ts">
import { SongInfoCard, SongMediaCard, SongTags } from "@/components/songs";
import { Options, Vue } from "vue-class-component";
import {
    PresentationControlPanel,
    PresentationPreview,
    ThemeSelector,
    SongSelector,
    LyricsCard,
    BackButton,
    Modal,
    BaseModal,
} from "@/components";
import { PlaylistAddToCard } from "@/components/playlist";
import { FolderAddIcon, DesktopComputerIcon, LockClosedIcon, ShoppingCartIcon, ArrowLeftIcon, PencilAltIcon } from "@heroicons/vue/solid";
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";
import { Collection } from "@/classes";
import { ApiPlaylist, MediaFile } from "dmb-api";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { notify } from "@/services/notify";
import { analytics } from "@/services/api";
import { appSession } from "@/services/session";
import { control } from "@/classes/presentation/control";

@Options({
    components: {
        PresentationControlPanel,
        PresentationPreview,
        ThemeSelector,
        SongSelector,
        LyricsCard,
        SongInfoCard,
        SongMediaCard,
        SongTags,
        BackButton,
        Modal,
        BaseModal,
        PlaylistCard: PlaylistAddToCard,
        FolderAddIcon,
        DesktopComputerIcon,
        LockClosedIcon,
        ShoppingCartIcon,
        ArrowLeftIcon,
        PencilAltIcon,
        SwitchGroup,
        Switch,
        SwitchLabel,
    },
    name: "song-viewer",
})
export default class SongViewer extends Vue {
    private store = useStore();
    public control = control;
    public number: number | string = 0;
    public selectedLanguage = this.languageKey;
    public selectedSheetMusic?: MediaFile = {} as MediaFile;
    public lyricsLoading = true;
    private songViewCount: number | null = null;
    public show = false;
    public unset = false;

    public setSong(songId: string) {
        this.$router.push({
            name: "song",
            params: {
                number: songId,
            },
        });
    }

    public setLyrics() {
        if (this.lyrics && this.lyrics?.id !== this.control.Lyrics?.id)
            this.control.setLyrics(this.lyrics);
    }

    public setTheme(theme: "dark" | "light") {
        this.control.setTheme(theme);
    }

    public set switchExtended(v) {
        //
    }
    public get switchExtended() {
        return this.isExtended;
    }

    /// PRESENTATION VIEW
    public toggleVerse(index: string) {
        this.control.toggleVerse(index);
        this.control.AvailableVerses;
    }

    public toggleAll() {
        if (this.lyrics) {
            this.control.toggleAll();
            if (this.control.AvailableVerses.length) {
                this.unset = false;
            } else {
                this.unset = true;
            }
        }
    }

    public refresh() {
        if (this.lyrics) {
            this.control.commit();
        }
    }

    public next() {
        this.control.next();
    }

    public previous() {
        this.control.previous();
    }
    
    public get viewCount() {
        return this.songViewCount ?? appSession.Views[this.song?.id ?? ""] ?? 0;
    }

    public componentLoading: {
        [key: string]: boolean;
    } = {};

    public openAdder() {
        this.show = true;
    }

    public closeAdder() {
        this.show = false;
    }

    public async beforeMount() {
        await this.load();
    }

    public async updated() {
        await this.load();
    }

    public async load() {
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, {
            show: false,
            loaded: false,
            clef: "treble",
            originalKey: "C",
        });
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, undefined);
        this.number = this.$route.params.number as string;
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

        if (this.song?.hasLyrics && this.collection)
        {
            if (this.store.state.songs.view == "transpose") {
                await this.collection?.transposeLyrics(
                    this.song.collections.find(s => s.id == this.collection?.id)?.number ?? 0, 
                    this.store.state.songs.transposition ?? 0,
                    this.selectedLanguage,
                );
            }
            else {
                await this.collection?.getLyrics(this.song, this.store.state.songs.language);
            }  
        }

        const route = this.$route.fullPath;
        const log = () => {
            if (route == this.$route.fullPath && this.song) {
                analytics.viewSong(this.song.id).then(r => {
                    this.songViewCount = r;
                    if (this.song)
                        appSession.Views[this.song.id] = r;
                });
                this.store.dispatch(
                    SessionActionTypes.LOG_SONG_ITEM,
                    this.song,
                );
            }
        };
        setTimeout(log, 5000);
        this.lyricsLoading = false;
        this.setLyrics();
    }

    public get user() {
        return this.store.getters.user;
    }

    public get admin() {
        return this.store.state.session.currentUser?.roles.some(r => ["editor", "administrator"].includes(r));
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

            notify("success", "Added to playlist",  "check", `Added "${song.getName()}" to playlist ${playlist.name}`, undefined, undefined, false);
        }
        // Close the modal
        this.closeAdder();
    }

    public goToEditPage() {
        window.open(`https://songtreasures.sanity.studio/desk/select-songs;${this.collection?.id};${this.song?.id}`);
    }

    public addToCart() {
        this.collection?.addToCart();
    }

    public get playlists() {
        return this.store.state.session.playlists.filter(p => p.userId == this.user?.id);
    }

    public get extended() {
        return this.store.getters.extended;
    }

    public get isExtended() {
        return this.store.state.session.extend;
    }

    public get isAdmin() {
        return this.store.getters.isAdmin;
    }

    public get loading() {
        return this.collection?.loading === true;
    }

    public get loadingLyrics() {
        return this.collection?.loadingLyrics === true;
    }

    public extend() {
        if (!this.control.Initialized) {
            this.control.init();
            this.refresh();
        }
        this.store.commit(SessionMutationTypes.EXTEND, !this.isExtended);
        // else {
        //     this.store.commit(SessionMutationTypes.SPLASH, {show: true, title: "In development", content: "This feature is still in development and will be available soon."});
        // }
    }

    public get song() {
        return this.collection?.songs.find(s => s.id == this.store.state.songs.songId);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>
