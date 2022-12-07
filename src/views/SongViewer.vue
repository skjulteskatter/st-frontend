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
                        <button @click="toggleFavorite" :disabled="favorites.loading" class="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10" title="Add to favorites">
                            <component :is="favorite ? 'HeartIcon' : 'HeartOutline'" :class="[favorite ? 'text-red-500 dark:text-red-400' : 'opacity-50', 'w-6 h-6']" />
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
                                    <button aria-label="Create new collection" title="Create new collection" class="ml-auto rounded-md px-2 py-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold" @click="showPlaylistModal = true">
                                        <PlusIcon class="w-4 h-4" />
                                    </button>
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
                            v-model="isExtended"
                            class="focus-visible:outline-none"
                            :class="{ 'opacity-50 cursor-not-allowed': lyrics?.ContainsChords }"
                        >
                            <div
                                class="relative inline-flex items-center h-6 rounded-full w-10 transition-colors"
                                :class="isExtended ? 'bg-primary' : 'bg-black/20 dark:bg-white/40'"
                            >
                                <span
                                    :class="isExtended ? 'translate-x-5' : 'translate-x-1'"
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
                            :language="languageKey"
                            :viewCount="viewCount"
                            :collection="collection"
                            :isAdmin="isAdmin"
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
                        <OpenSheetMusicDisplay
                            v-if="sheetMusicOptions?.show === true && sheetMusicOptions?.type === 'sheetmusic'"
                            :options="sheetMusicOptions"
                            :relativeKey="user?.settings?.defaultTransposition"
                            :languageKey="languageKey"
                            @close="() => sheetMusicOptions ? sheetMusicOptions.show = false : undefined"
                        />
                        <div
                            v-if="sheetMusicOptions?.show && sheetMusicOptions?.type == 'sheetmusic-pdf'"
                            class="w-full h-full"
                        >
                            <div class="p-4 flex justify-end bg-white w-full">
                                <BaseButton theme="error" @click="sheetMusicOptions ? sheetMusicOptions.show = false : undefined">
                                    <template #icon>
                                        <XIcon class="w-4 h-4" />
                                    </template>
                                    {{$t('common_close')}}
                                </BaseButton>
                            </div>
                            <object 
                                :key="sheetMusicOptions?.url" 
                                :data="sheetMusicOptions?.url + '\#toolbar=0'" 
                                type="application/pdf" 
                                class="flex-grow" 
                                title="PDF cannot be displayed." 
                                width="100%"
                                height="720px"
                            ></object>
                        </div>
                        <PresentationPreview
                            v-if="song.hasLyrics && isExtended && lyrics"
                            :text="lyrics?.getText({
                                chorus: $t('song_chorus'),
                                bridge: $t('song_bridge'),
                            }, true) ?? []"
                            :availableVerses="control.AvailableVerses"
                            :currentVerses="control.currentVerses"
                            @toggleAll="toggleAll()"
                            @toggle="toggleVerse"
                        />
                    </div>
                    <aside>
                        <SongMediaCard
                            v-if="!isExtended"
                            :song="song"
                            :collection="collection"
                            @setAudioTrack="(t) => audioTrack = t"
                            @setSheetMusic="(m) => sheetMusicOptions = m"
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
                            <SongSelector 
                                :loading="fullLoading"
                                :songs="collection?.songs" 
                                @setSong="setSong"
                                @next="song.next()"
                                @previous="song.previous()"
                            />
                            <ThemeSelector 
                                :theme="control.Settings?.theme" 
                                :showSideBar="control.Settings?.showSideBar" 
                                :singleVerse="control.Settings?.singleVerse"
                                :sync="control.Settings?.sync"
                                @update:sync="setSync"
                                @setTheme="setTheme" 
                                @toggleSidebar="toggleSidebar"
                                @toggleSingleVerse="toggleSingleVerse"
                            />
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
        <BaseModal :show="showPresentationPopup">
            <div class="flex flex-col items-center max-w-lg gap-2">
                <h1 class="text-lg">Presentation has been moved</h1>
                <p>This functionality will disappear from here the 1st of January 2023</p>
                <p>Go to the new solution to purchase a presentation license.</p>
                <div class="flex ml-auto gap-2">
                    <BaseButton theme="secondary" @click="goToWidescreen()">Go to new Solution</BaseButton>
                    <BaseButton @click="showPresentationPopup = false; (isExtended = true)">Continue</BaseButton>
                </div>
            </div>
        </BaseModal>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { SongInfoCard, SongMediaCard, SongTags } from "@/components/songs";
import {
    LyricsCard,
    BackButton,
    BaseModal,
} from "@/components";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import {
    PresentationControlPanel,
    PresentationPreview,
    ThemeSelector,
    SongSelector,
} from "@/components/presentation";
import { PlaylistAddToCard, CreatePlaylistModal } from "@/components/playlist";
import { FolderAddIcon, LockClosedIcon, ShoppingCartIcon, ArrowLeftIcon, PencilAltIcon, HeartIcon, PlusIcon, XIcon } from "@heroicons/vue/solid";
import { HeartIcon as HeartOutline } from "@heroicons/vue/outline";
import { SwitchGroup, Switch, SwitchLabel } from "@headlessui/vue";
import { Collection, Lyrics, Song, transposer } from "@/classes";
import { ICustomCollection, Format, IMediaFile } from "songtreasures-api";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { notify } from "@/services/notify";
import { analytics } from "@/services/api";
import { appSession } from "@/services/session";
import { AudioTrack, SongViewType } from "@/store/modules/songs/state";
import { SheetMusicOptions } from "songtreasures";
import { presentation } from "@/classes/presentation";

export default defineComponent({
    name: "song-viewer",
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
        BaseModal,
        OpenSheetMusicDisplay,
        PlaylistCard: PlaylistAddToCard,
        CreatePlaylistModal,
        FolderAddIcon,
        LockClosedIcon,
        ShoppingCartIcon,
        ArrowLeftIcon,
        PencilAltIcon,
        HeartIcon,
        PlusIcon,
        HeartOutline,
        SwitchGroup,
        Switch,
        SwitchLabel,
        XIcon,
    },
    data: () => ({
        store: useStore(),
        control: presentation,
        number: 0 as number | string,
        selectedSheetMusic: {} as IMediaFile,
        sheetMusicOptions: null as SheetMusicOptions | null,
        songViewCount: null as number | null,
        show: false,
        unset: false,
        showPlaylistModal: false,
        lyrics: null as Lyrics | null,
        componentLoading: {} as {
            [key: string]: boolean;
        },
        fullLoading: false,
        favorite: false,
        showSheet: false,
        presentationPopupShown: false,
        showPresentationPopup: false,
    }),
    computed: {
        selectedLanguage() {
            return this.languageKey;
        },
        favorites() {
            return appSession.favorites;
        },
        user() {
            return appSession.user;
        },
        admin() {
            return appSession.user.roles.some(r => ["editor", "administrator"].includes(r));
        },
        audioTrack: {
            get() {
                return undefined;
            },
            set(v: AudioTrack) {
                this.store.commit(SongsMutationTypes.SET_AUDIO, v);
            },
        },
        playlists() {
            return this.store.state.session.playlists.filter(p => p.userId == this.user?.id);
        },
        extended() {
            return this.store.getters.extended;
        },
        isExtended: {
            get() {
                return this.store.state.session.extend;
            },
            set(value: boolean) {
                if (!this.presentationPopupShown) {
                    this.showPresentationPopup = true
                    this.presentationPopupShown = true
                    return
                }
                if (!this.control.Initialized) {
                    this.control.initialize("control");
                    if (this.lyrics)
                        this.control.setLyrics(this.lyrics);
                    this.refresh();
                }
                this.store.commit(SessionMutationTypes.EXTEND, value);
            },
        },
        isAdmin() {
            return this.store.getters.isAdmin;
        },
        loading() {
            return this.collection?.loading === true;
        },
        loadingLyrics() {
            return this.song?.loadingLyrics === true;
        },
        song() {
            return this.collection?.songs.find(s => s.id == this.store.state.songs.songId) as Song;
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
        collection() {
            return this.store.getters.collection as Collection;
        },
        type() {
            return this.store.state.songs.view;
        },
        defaultTransposition() {
            return this.user.settings?.defaultTransposition ?? "C";
        },
        selectedTransposition: {
            get() {
                return this.store.state.songs.transposition ?? 0;
            },
            set(v: number) {
                this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, v);
            },
        },
        viewCount() {
            return this.songViewCount ?? appSession.Views[this.song?.id ?? ""] ?? 0;
        },
    },
    async beforeMount() {
        await this.load();
    },
    mounted() {
        this.onKeyDown = this.onKeyDown.bind(this);
        addEventListener("keydown", this.onKeyDown);
        this.favorite = this.favorites.has(this.song?.id);
    },
    async updated() {
        await this.load();
        this.favorite = this.favorites.has(this.song?.id);
    },
    unmounted() {
        removeEventListener("keydown", this.onKeyDown);
    },
    methods: {
        setSong(songId: string) {
            this.$router.push({
                name: "song",
                params: {
                    number: songId,
                },
            });
        },
        setLyrics() {
            this.control.setSong(this.song);
            this.control.setContributors(appSession.contributors.filter(i => this.song?.participants.some(p => p.contributorId === i.id)).map(i => i.item));
            if (this.lyrics && !this.lyrics.ContainsChords)
                this.control.setLyrics(this.lyrics);
        },
        toggleSidebar() {
            this.control.toggleSidebar();
        },
        toggleSingleVerse() {
            this.control.toggleSingleVerse();
        },
        setTheme(theme: "dark" | "light") {
            this.control.setTheme(theme);
        },
        // PRESENTATION VIEW
        toggleVerse(index: string) {
            this.control.toggleVerse(index);
            this.control.AvailableVerses;
        },
        setSync(v: boolean) {
            this.control.setSync(v)
        },
        toggleAll() {
            if (this.lyrics) {
                this.control.toggleAll();
                this.unset = !this.control.AvailableVerses.length;
            }
        },
        refresh() {
            this.control.commit();
        },
        next() {
            this.control.next();
        },
        goToWidescreen() {
            window.location.replace("https://presentation.songtreasures.app")
        },
        previous() {
            this.control.previous();
        },
        openAdder() {
            this.show = true;
        },
        closeAdder() {
            this.show = false;
        },
        onKeyDown(e: KeyboardEvent) {
            if (e.ctrlKey && e.altKey && e.code === "KeyP") {
                this.isExtended = !this.isExtended;
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.altKey && e.code === "KeyS") {
                this.toggleSidebar();
                e.preventDefault();
                return false;
            }
        },
        async load() {
            if (this.fullLoading) {
                return;
            }
            this.fullLoading = true;
            this.store.commit(SongsMutationTypes.SET_SHEETMUSIC_OPTIONS, {
                fileId: "",
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
        },
        async addToPlaylist(playlist: ICustomCollection) {
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
        },
        goToEditPage() {
            window.open(`https://songtreasures.sanity.studio/desk/select-songs;${this.collection?.id};${this.song?.id}`);
        },
        getTransposedLyrics(language?: string, format?: Format) {
            return this.song?.transposeLyrics(transposer.getRelativeTransposition(this.defaultTransposition), language ?? this.store.state.songs.language, undefined, this.store.state.songs.newMelody, format ?? "performance");
        },
        async translate(language: string) {
            if (this.song?.hasLyrics === true) {
                switch(this.store.state.songs.view) {
                    case "chords":
                    case "performance":
                        this.lyrics = await this.getTransposedLyrics(language, "performance") as Lyrics;
                        break;
                    default:
                        this.lyrics = await this.song.getLyrics(language);
                }
                this.store.commit(
                    SongsMutationTypes.LANGUAGE,
                    language,
                );
            }
        },
        async setView(type: SongViewType) {
            if (this.type !== type)
                this.store.commit(SongsMutationTypes.VIEW, type);

            if (!this.song?.hasLyrics)
                return;

            if (type === "chords" || type === "performance") {
                this.lyrics = await this.getTransposedLyrics(undefined, "performance") as Lyrics;
            } else {
                this.lyrics = await this.song?.getLyrics(this.store.state.songs.language);
            }
        },
        async transpose(n?: number) {
            if (n !== undefined) {
                this.selectedTransposition = n;
            }

            if (this.song) {
                this.lyrics = await this.song?.transposeLyrics(
                    this.selectedTransposition,
                    this.store.state.songs.language,
                    undefined,
                    this.store.state.songs.newMelody,
                    this.lyrics?.format,
                );
            }
        },
        async toggleFavorite() {
            await this.favorites.toggle(this.song?.id);
            this.favorite = !this.favorite;
        },
    },
});
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
