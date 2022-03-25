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
                            @click="extend()"
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
                        />
                        <div
                            v-if="sheetMusicOptions?.show && sheetMusicOptions?.type == 'sheetmusic-pdf'"
                            class="w-full h-full"
                        >
                            <div class="p-4 flex justify-end bg-white w-full">
                                <BaseButton theme="error" @click="sheetMusicOptions.show = false">
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
                            @mounted="setLyrics"
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
                            <SongSelector :songs="songs" @setSong="setSong" />
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
                    <img class="max-h-12 rounded" height="48" :src="collection.image" :alt="collection.title">
                    <p>{{ collection.title }}</p>
                </div>
                <div class="flex gap-4 mt-8">
                    <BaseButton theme="tertiary" @click="$router.back()">
                        <template #icon>
                            <ArrowLeftIcon class="w-4 h-4" />
                        </template>
                        {{ $t('common_back') }}
                    </BaseButton>
                    <BaseButton theme="secondary">
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
import { ICustomCollection, Format } from "songtreasures-api";
import { notify } from "@/services/notify";
import { appSession } from "@/services/session";
import { control } from "@/classes/presentation/control";
import { SheetMusicOptions } from "songtreasures";
import songService from "@/services/songs/songService";

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
        control: control,
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
        song: null as Song | null,
        collection: null as Collection | null,
        songs: null as Song[] | null,
    }),
    computed: {
        favorites() {
            return appSession.favorites;
        },
        user() {
            return appSession.user;
        },
        defaultTransposition() {
            return this.user.settings?.defaultTransposition ?? "C";
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
            if (this.lyrics && !this.lyrics.ContainsChords && this.lyrics?.id !== this.control.Lyrics?.id)
                this.control.setLyrics(this.lyrics);
        },
        toggleSidebar() {
            this.control.toggleSidebar();
        },
        setTheme(theme: "dark" | "light") {
            this.control.setTheme(theme);
        },
        // PRESENTATION VIEW
        toggleVerse(index: string) {
            this.control.toggleVerse(index);
            this.control.AvailableVerses;
        },
        toggleAll() {
            if (this.lyrics) {
                this.control.toggleAll();
                this.unset = !this.control.AvailableVerses.length;
            }
        },
        refresh() {
            if (this.lyrics) {
                this.control.commit();
            }
        },
        next() {
            this.control.next();
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
                this.extend();
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
            const {collection, number} = this.$route.params as {[key: string]: string};
            this.collection = appSession.getCollection(collection);
            if (!this.collection)
                throw new Error("Collection not found");

            this.songs = await songService.childrenOf(this.collection.id);
            for (const song of this.songs) {
                if (song.id === number) {
                    this.song = song;
                }
                const parsedNumber = parseInt(number);

                if (parsedNumber) {
                    for (const c of song.collections) {
                        if (c.collectionId === this.collection.id && c.number === parsedNumber) {
                            this.song = song;
                        }
                    }
                }
            }

            if (!this.song)
                throw new Error("Song not found");
            
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

                this.componentLoading[playlist.id] = false;

                notify("success", "Added to playlist",  "check", `Added "${song.title}" to playlist ${playlist.name}`, undefined, undefined, false);
            }
            // Close the modal
            this.closeAdder();
        },
        goToEditPage() {
            window.open(`https://songtreasures.sanity.studio/desk/select-songs;${this.collection?.id};${this.song?.id}`);
        },
        extend() {
            if (!this.control.Initialized) {
                this.control.init();
                if (this.lyrics)
                    this.control.setLyrics(this.lyrics);
                this.refresh();
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
