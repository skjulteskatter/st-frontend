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
                        <h3 class="mt-0 font-bold mb-4">
                            {{ $t('common.select') }} {{ $t("common.collection").toLocaleLowerCase() }}
                        </h3>
                        <div class="flex flex-col gap-2 max-h-72 w-96 overflow-y-auto">
                            <playlist-card
                                v-for="playlist in playlists"
                                :key="playlist.id"
                                :playlist="playlist"
                                @click="addToPlaylist(playlist)"
                            />
                        </div>
                    </base-modal>
                    <SwitchGroup as="div" class="hidden md:flex flex-col gap-1 cursor-pointer" v-if="song?.hasLyrics && (isExtended || isAdmin)">
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
                                :class="switchExtended ? 'bg-primary' : 'bg-black/20 dark:bg-black/40'"
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
                </div>
                <aside>
                    <component
                        :is="isExtended ? 'PresentationControl' : 'SongMediaCard'"
                        :song="song"
                        :lyrics="lyrics ?? undefined"
                        :languageKey="languageKey ?? undefined"
                        class="sticky top-20"
                    />
                </aside>
            </div>
        </div>
    </loader>
    <base-modal
        :show="song ? !song.available : false"
    >
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
    PresentationControl,
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

@Options({
    components: {
        PresentationControl,
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
    public number: number | string = 0;
    public selectedLanguage = this.languageKey;
    public selectedSheetMusic?: MediaFile = {} as MediaFile;
    public lyricsLoading = true;
    private songViewCount: number | null = null;
    public show = false;
    public switchExtended = false;
    
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
    }

    public goToEditPage() {
        window.open(`https://songtreasures.sanity.studio/desk/select-songs;${this.collection?.id};${this.song?.id}`);
    }

    public addToCart() {
        this.collection?.addToCart();
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
        if (this.isAdmin)
            this.store.commit(SessionMutationTypes.EXTEND, !this.isExtended);
        else {
            this.store.commit(SessionMutationTypes.SPLASH, {show: true, title: "In Development", content: "This feature is still in development and will be available soon."});
        }
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
