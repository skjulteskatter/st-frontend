<template>
    <div>
        <Loader :loading="loading">
            <div v-if="song" class="flex flex-col gap-4">
                <div class="flex justify-between">
                    <BackButton :to="`/songs/${collection?.key}`" />
                    <div class="flex gap-2 items-center ml-auto">
                        <span v-if="isAdmin" class="bg-black/10 dark:bg-white/10 text-sm py-2 px-3 rounded-md hidden xl:block">{{ song.id }}</span>
                        <BaseButton
                            v-if="isAdmin"
                            @click="goToEditPage()"
                            theme="tertiary"
                            class="mr-4 hidden lg:flex"
                        >
                            <template #icon>
                                <PencilAltIcon class="w-4 h-4" />
                            </template>
                            {{ $t('common_edit') }}
                        </BaseButton>
                        <button v-if="isAdmin" @click="favorites.toggle(song?.id)" :disabled="favorites.loading" class="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10" title="Add to favorites">
                            <HeartIcon class="w-6 h-6 text-red-500 dark:text-red-400" v-if="favorites.has(song?.id)" />
                            <HeartOutline class="w-6 h-6 opacity-50" v-else />
                        </button>
                        <BaseButton theme="secondary" @click="openAdder()" v-if="playlists.length" class="playlist-adder">
                            <template #icon>
                                <FolderAddIcon class="w-4 h-4" />
                            </template>
                            {{ $t('common_addTo') + ' ' + $t('common_collection').toLowerCase() }}
                        </BaseButton>
                        <BaseModal :show="show" @close="closeAdder()">
                            <template #title>
                                <div class="flex gap-4 items-center flex-grow">
                                    <h3 class="font-bold">
                                        {{ $t('common_select') }} {{ $t("common_collection").toLocaleLowerCase() }}
                                    </h3>
                                    <button aria-label="Create new collection" title="Create new collection" class="ml-auto rounded-md px-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold" @click="showPlaylistModal = true">+</button>
                                </div>
                            </template>
                            <CreatePlaylistModal :show="showPlaylistModal" @close="showPlaylistModal = false" />
                            <div class="flex flex-col gap-2 max-h-72 w-96 overflow-y-auto shadow-scroll">
                                <PlaylistCard
                                    v-for="playlist in playlists"
                                    :key="playlist.id"
                                    :playlist="playlist"
                                    @click="addToPlaylist(playlist)"
                                />
                            </div>
                        </BaseModal>
                    </div>
                </div>
                <div class="flex justify-between">
                    <SongTags :song="song" />
                    <SwitchGroup as="div" class="hidden md:flex gap-2 items-center cursor-pointer" v-if="song?.hasLyrics">
                        <SwitchLabel class="text-xs tracking-wide">{{ $t("song_viewer") }}</SwitchLabel>
                        <Switch
                            :disabled="lyrics?.ContainsChords"
                            @click="extend()"
                            v-model="switchExtended"
                            class="focus-visible:outline-none"
                            :class="{ 'opacity-50 cursor-not-allowed': lyrics?.ContainsChords }"
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
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="flex flex-col gap-4 md:col-span-2">
                        <SongInfoCard
                            :song="song"
                            :languageKey="languageKey"
                            :viewCount="viewCount"
                            class="md:col-span-2"
                        />
                        <LyricsCard
                            :class="{ 'hidden': sheetMusicOptions?.show }"
                            v-if="song.hasLyrics && !isExtended"
                            :loading="loadingLyrics"
                            :song="song"
                            :lyrics="lyrics"
                            :collection="collection"
                            :type="type"
                            @translate="translate"
                            @transpose="transpose"
                            @setView="setView"
                        />
                        <PresentationPreview
                            v-if="song.hasLyrics && isExtended && lyrics"
                            :text="lyrics?.getText({
                                chorus: this.$t('song_chorus'),
                                bridge: this.$t('song_bridge'),
                            }, true) ?? []"
                            :availableVerses="control.AvailableVerses"
                            :currentVerses="control.currentVerses"
                            @mounted="setLyrics"
                            @toggleAll="toggleAll()"
                            @toggle="toggleVerse"
                        />
                    </div>
                    <aside>
                        <SongMediaCard
                            v-if="!isExtended"
                            :song="song"
                            :lyrics="lyrics ?? undefined"
                            :languageKey="languageKey ?? undefined"
                            class="sticky top-20"
                        />
                        <div v-else class="sticky top-20 flex flex-col gap-4">
                            <PresentationControlPanel
                                @refresh="refresh()"
                                @open="control.open()"
                                @next="next()"
                                @previous="previous()"
                                @mute="control.mute()"
                            />
                            <SongSelector :songs="collection?.songs" @setSong="setSong" />
                            <ThemeSelector :theme="control.Settings?.theme" :showSideBar="control.Settings?.showSideBar" @setTheme="setTheme" @toggleSidebar="toggleSidebar" />
                        </div>
                    </aside>
                </div>
            </div>
        </Loader>
        <BaseModal :show="song ? !song.available : false">
            <div class="flex flex-col items-center">
                <LockClosedIcon class="w-10 h-10 text-primary my-4" />
                <h2 class="text-2xl font-bold">{{ $t('store_limitedAccess') }}</h2>
                <p class="text-center">{{ $t('store_gainAccess') }}</p>
                <div class="p-2 rounded-md border border-gray-300 mt-4 flex items-center gap-4" v-if="collection">
                    <img class="max-h-12 rounded" height="48" :src="collection.image" :alt="collection.getName(languageKey)">
                    <p>{{ collection.getName(languageKey) }}</p>
                </div>
                <div class="flex gap-4 mt-8">
                    <BaseButton theme="tertiary" @click="$router.back()">
                        <template #icon>
                            <ArrowLeftIcon class="w-4 h-4" />
                        </template>
                        {{ $t('common_back') }}
                    </BaseButton>
                    <BaseButton theme="secondary" @click="collection?.addToCart">
                        <template #icon>
                            <ShoppingCartIcon class="w-4 h-4" />
                        </template>
                        {{ $t('store_addToCart') }}
                    </BaseButton>
                </div>
            </div>
        </BaseModal>
    </div>
</template>
<script lang="ts">
import { SongInfoCard, SongMediaCard, SongTags } from "@/components/songs";
import { Options, Vue } from "vue-class-component";
import {
    LyricsCard,
    BackButton,
    Modal,
    BaseModal,
} from "@/components";
import {
    PresentationControlPanel,
    PresentationPreview,
    ThemeSelector,
    SongSelector,
} from "@/components/presentation";
import { PlaylistAddToCard, CreatePlaylistModal } from "@/components/playlist";
import { FolderAddIcon, DesktopComputerIcon, LockClosedIcon, ShoppingCartIcon, ArrowLeftIcon, PencilAltIcon, HeartIcon } from "@heroicons/vue/solid";
import { HeartIcon as HeartOutline } from "@heroicons/vue/outline";
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";
import { Lyrics, transposer } from "@/classes";
import { ICustomCollection, Format, MediaFile } from "songtreasures";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { notify } from "@/services/notify";
import { analytics } from "@/services/api";
import { appSession } from "@/services/session";
import { control } from "@/classes/presentation/control";
import { SongViewType } from "@/store/modules/songs/state";

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
        CreatePlaylistModal,
        FolderAddIcon,
        DesktopComputerIcon,
        LockClosedIcon,
        ShoppingCartIcon,
        ArrowLeftIcon,
        PencilAltIcon,
        HeartIcon,
        HeartOutline,
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
    private songViewCount: number | null = null;
    public show = false;
    public unset = false;
    public showPlaylistModal = false;

    public favorites = appSession.favorites;

    public lyrics?: Lyrics | null = null;

    public setSong(songId: string) {
        this.$router.push({
            name: "song",
            params: {
                number: songId,
            },
        });
    }

    public setLyrics() {
        if (this.lyrics && !this.lyrics.ContainsChords && this.lyrics?.id !== this.control.Lyrics?.id)
            this.control.setLyrics(this.lyrics);
    }

    public toggleSidebar() {
        this.control.toggleSidebar();
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
            this.unset = !this.control.AvailableVerses.length;
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

    private fullLoading = false;

    public async load() {
        if (this.fullLoading) {
            return;
        }
        this.fullLoading = true;
        this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, {
            show: false,
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
            if (this.lyrics?.ContainsChords) {
                this.lyrics = await this.song?.transposeLyrics( 
                    this.store.state.songs.transposition ?? 0,
                    this.selectedLanguage,
                );
            }
            else {
                this.lyrics = await this.song?.getLyrics(this.store.state.songs.language);
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
        this.setLyrics();
        this.setView(this.store.state.songs.view);
        this.fullLoading = false;
    }

    public get user() {
        return this.store.getters.user;
    }

    public get admin() {
        return this.store.state.session.currentUser?.roles.some(r => ["editor", "administrator"].includes(r));
    }

    public get sheetMusicOptions(): SheetMusicOptions | undefined {
        return this.store.state.songs.sheetMusic;
    }

    // public async setFavorites(id: string) {
    //     let favorites;
    //     if(this.favorites.includes(id)) {
    //         favorites = this.favorites.filter(f => f != id);
    //     } else {
    //         favorites = [...this.favorites, id];
    //     }
    //     await cache.set("general", "favorites", {
    //         expiry: new Date().getTime() + 60000,
    //         item: JSON.stringify(favorites),
    //     });
    // }

    public async addToPlaylist(playlist: ICustomCollection) {
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
        return this.song?.loadingLyrics === true;
    }

    public extend() {
        if (!this.control.Initialized) {
            this.control.init();
            if (this.lyrics)
                this.control.setLyrics(this.lyrics);
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

    public get collection() {
        return this.store.getters.collection;
    }

    private getTransposedLyrics(language?: string, format?: Format) {
        return this.song?.transposeLyrics(transposer.getRelativeTransposition(this.defaultTransposition), language ?? this.store.state.songs.language, undefined, this.store.state.songs.newMelody, format ?? "performance");
    }

    public async translate(language: string) {
        if (this.song?.hasLyrics === true) {
            switch(this.store.state.songs.view) {
                case "chords":
                case "performance":
                    this.lyrics = await this.getTransposedLyrics(language, "performance");
                    break;
                default:
                    this.lyrics = await this.song.getLyrics(language);
            }
            this.store.commit(
                SongsMutationTypes.LANGUAGE,
                language,
            );
        }
    }

    public get type() {
        return this.store.state.songs.view;
    }

    public async setView(type: SongViewType) {
        if (this.type !== type)
            this.store.commit(SongsMutationTypes.VIEW, type);

        if (!this.song?.hasLyrics)
            return;

        if (type === "chords" || type === "performance") {
            this.lyrics = await this.getTransposedLyrics(undefined, "performance");
        } else {
            this.lyrics = await this.song?.getLyrics(this.store.state.songs.language);
        }
    }
    
    public get defaultTransposition() {
        return this.store.getters.user?.settings?.defaultTransposition ?? "C";
    }

    public get selectedTransposition() {
        return this.store.state.songs.transposition ?? 0;
    }

    public set selectedTransposition(v) {
        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, v);
    }

    public async transpose(n?: number) {
        if (n !== undefined) {
            this.selectedTransposition = n;
        }

        if (this.song) {
            this.lyrics = await this.song?.transposeLyrics(
                this.selectedTransposition,
                this.store.state.songs.language,
                undefined,
                this.store.state.songs.newMelody,
                this.lyrics?.format
            );
        }
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.shadow-scroll {
    @include scrollShadow(white);
    max-height: 400px;
    overflow-y: auto;
}

.dark {
    .shadow-scroll {
        @include scrollShadow(#213F47);
    }
}
</style>
