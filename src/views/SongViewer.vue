<template>
    <div class="flex flex-col gap-4" v-if="collection && song">
        <div class="flex justify-between">
            <BackButton :to="`/songs/${collection.key}`" />
            <div class="flex gap-2 items-center ml-auto">
                <span v-if="isAdmin" class="bg-black/10 dark:bg-white/10 text-sm py-2 px-3 rounded-md hidden xl:block">{{ song.id }}</span>
                <BaseButton
                    v-if="isAdmin"
                    theme="tertiary"
                    class="mr-4 hidden lg:flex"
                >
                    <template #icon>
                        <PencilAltIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_edit') }}
                </BaseButton>
                <!-- <button @click="toggleFavorite" :disabled="favorites.loading" class="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10" title="Add to favorites">
                    <component :is="favorite ? 'HeartIcon' : 'HeartOutline'" :class="[favorite ? 'text-red-500 dark:text-red-400' : 'opacity-50', 'w-6 h-6']" />
                </button> -->
                <!-- <BaseButton theme="secondary" @click="openAdder()" v-if="playlists.length" class="playlist-adder">
                    <template #icon>
                        <FolderAddIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_addTo') + ' ' + $t('common_collection').toLowerCase() }}
                </BaseButton> -->
                <!-- <BaseModal :show="show" @close="closeAdder()">
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
                </BaseModal> -->
            </div>
        </div>
        <div class="flex justify-between">
            <SongTags :song="song" />
            <SwitchGroup as="div" class="hidden md:flex gap-2 items-center cursor-pointer" v-if="song?.hasLyrics">
                <SwitchLabel class="text-xs tracking-wide">{{ $t("song_viewer") }}</SwitchLabel>
                <Switch
                    :disabled="true"
                    v-model="presentationView"
                    class="focus-visible:outline-none"
                    :class="{ 'opacity-50 cursor-not-allowed': true }"
                >
                    <div
                        class="relative inline-flex items-center h-6 rounded-full w-10 transition-colors"
                        :class="presentationView ? 'bg-primary' : 'bg-black/20 dark:bg-white/40'"
                    >
                        <span
                            :class="presentationView ? 'translate-x-5' : 'translate-x-1'"
                            class="shadow-md inline-block w-4 h-4 transform bg-white rounded-full transition-transform dark:bg-secondary"
                        />
                    </div>
                </Switch>
            </SwitchGroup>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col gap-4 md:col-span-2">
                <SongInfoCard
                    v-if="data.song"
                    :view="data.song"
                    :language="language"
                    :collection="collection"
                    :isAdmin="isAdmin"
                    class="md:col-span-2"
                />
                <!-- <LyricsCard
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
                /> -->
                <!-- <OpenSheetMusicDisplay
                    v-if="sheetMusicOptions?.show === true && sheetMusicOptions?.type === 'sheetmusic'"
                    :options="sheetMusicOptions"
                    :relativeKey="defaultTransposition"
                /> -->
                <!-- <div
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
                </div> -->
                <!-- <PresentationPreview
                    v-if="song.hasLyrics && lyrics"
                    :text="lyrics?.getText({
                        chorus: $t('song_chorus'),
                        bridge: $t('song_bridge'),
                    }, true) ?? []"
                    :availableVerses="control.AvailableVerses"
                    :currentVerses="control.currentVerses"
                    @mounted="setLyrics"
                    @toggleAll="toggleAll()"
                    @toggle="toggleVerse"
                /> -->
            </div>
            <aside>
                <!-- <SongMediaCard
                    v-if="!isExtended"
                    :song="song"
                    :collection="collection"
                    @setAudioTrack="(t) => audioTrack = t"
                    @setSheetMusic="(m) => sheetMusicOptions = m"
                    class="sticky top-20"
                /> -->
                <!-- <div v-else-if="songs" class="sticky top-20 flex flex-col gap-4">
                    <PresentationControlPanel
                        @refresh="refresh()"
                        @open="control.open()"
                        @next="next()"
                        @previous="previous()"
                        @mute="control.mute()"
                    />
                    <SongSelector :collection="collection" :songs="songs" />
                    <ThemeSelector :theme="control.Settings?.theme" :showSideBar="control.Settings?.showSideBar" @setTheme="setTheme" @toggleSidebar="toggleSidebar" />
                </div> -->
            </aside>
        </div>
        <BaseModal :show="!song.available">
            <div class="flex flex-col items-center">
                <LockClosedIcon class="w-10 h-10 text-primary my-4" />
                <h2 class="text-2xl font-bold">{{ $t('store_limitedAccess') }}</h2>
                <p class="text-center">{{ $t('store_gainAccess') }}</p>
                <div class="p-2 rounded-md border border-gray-300 mt-4 flex items-center gap-4" v-if="collection">
                    <img class="max-h-12 rounded" height="48" :src="collection.image ?? undefined" :alt="collection.title">
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
<script lang="ts" setup>
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
import { transposer } from "@/classes";
import { ICustomCollection, Format } from "songtreasures-api";
import { notify } from "@/services/notify";
import { appSession } from "@/services/session";
import { control } from "@/classes/presentation/control";
import { SheetMusicOptions } from "songtreasures";
import songService from "@/services/songs/songService";
import SongView from "@/classes/views/songView";
import client from "@/services/client";
import { Collection, Lyrics, Song } from "hiddentreasures-js";
import router from "@/router";
import { reactive, computed, ref } from "vue";

const isAdmin = appSession.session.roles.some(r => r.fulfills("extended"));

const presentationView = ref(false);

const language = ref(appSession.Language);

const data = reactive({
    collection: null as Collection | null,
    song: null as SongView | null,
    songs: null as Song[] | null,
    lyrics: null as Lyrics | null,
});

const loadView = async () => {
    const {collection, number} = router.currentRoute.value.params as {[key: string]: string};
    const col = appSession.getCollection(collection);
    if (!col)
        throw new Error("Collection not found");

    const songs = await songService.childrenOf(col.id);
    let song: SongView | null = null;
    for (const s of songs) {
        if (s.id === number) {
            song = new SongView(s);
            break;
        }
        const parsedNumber = parseInt(number);

        if (parsedNumber) {
            for (const c of s.collections) {
                if (c.collectionId === col.id && c.number === parsedNumber) {
                    song = new SongView(s);
                    break;
                }
            }
        }
    }

    if (!song)
        throw new Error("Song not found");

    await song.load();

    data.collection = col;
    data.song = song;
    data.songs = songs;
};

const collection = computed(() => data.collection);
const song = computed(() => data.song?.item);
const songs = computed(() => data.songs);

loadView();
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
