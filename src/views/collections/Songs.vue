<template>
    <Loader :loading="loading">
        <BackButton class="mb-4" to="/collections" />
        <div class="mb-4 flex flex-wrap gap-4 items-start md:items-center">
            <h1 class="font-bold text-2xl md:text-3xl">
                {{ collection.title }}
            </h1>
            <BaseButton theme="secondary" v-if="!collection.owned">
                <template #icon>
                    <ShoppingCartIcon class="w-4 h-4" />
                </template>
                {{ $t('store_buy') }}
            </BaseButton>
            <BaseButton v-if="hasFiles" theme="neutral" @click="$router.push({name: 'collection-files', params: $route.params})">Show files</BaseButton>
            <button aria-label="Toggle list type" title="Toggle list type" class="ml-auto text-gray-500 dark:text-white/50 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10">
                <!-- <ViewGridIcon class="w-5 h-5" v-if="viewType == 'boards'" /> -->
                <ViewBoardsIcon class="w-5 h-5" />
            </button>
        </div>
        <div class="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
            <div class="flex flex-col gap-1 text-sm">
                <label for="song-category" class="text-gray-500 text-xs dark:text-gray-400">
                    {{ $t("song_sortby") }}
                </label>
                <!-- <ButtonGroup
                    :buttons="buttons"
                    :action="setListType"
                    class="hidden md:flex"
                /> -->
                <!-- <select
                    class="p-2 pr-6 bg-white border border-black/20 rounded-md block text-sm md:hidden dark:bg-secondary dark:border-white/20"
                    @input="setListType"
                >
                    <option
                        v-for="category in buttons"
                        :key="category.value"
                        :value="category.value"
                        :selected="category.value == listType"
                    >
                        {{ category.label }}
                    </option>
                </select> -->
            </div>
            <!-- <div class="md:hidden">
                <label for="song-filters" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t("song_filterByContent") }}
                </label>
                <SongFilterSelect @apply="loadList" />
            </div>
            <div class="flex gap-2 items-stretch">
                <SearchInput
                    class="md:max-w-xs"
                    type="text"
                    :placeholder="$t('common_search')"
                    v-model="searchString"
                    @search="search"
                    @keyup="filterByNumber"
                />
                <SongFilterDropdown :songs="collection.songs" @apply="loadList" class="hidden md:flex" />
            </div> -->
        </div>
        <div
            class="song-list columns-xs gap-4"
            v-if="songs?.length"
        >
            <SongListCard
                :collection="collection"
                v-for="(e, i) in songs"
                :key="i"
                :songs="e.songs"
                :title="e.title"
                :action="e.action"
                :count="e.count"
                class="mb-4"
                />
        </div>
        <!-- <div v-else-if="viewType == 'grid'" class="flex gap-2 flex-wrap">
            <button
                v-for="s in songs.sort((a, b) => a.number > b.number ? 1 : -1)"
                :key="s?.id ?? Math.random()"
                class="tracking-wide text-sm cursor-pointer shadow px-2 py-1 rounded-md hover:ring-2 hover:ring-gray-400 bg-white dark:bg-secondary flex-grow"
                @click="s.view()"
                aria-label="Open song"
                title="Open song"
            >
                {{ s.number }}
            </button>
        </div> -->
        <h1 class="opacity-50" v-if="!songs?.length && !loading">
            No results
        </h1>
        <!-- <BaseModal
            :show="showCta"
            @close="closeCta"
        >
            <div class="flex flex-col gap-4 items-center">
                <LockClosedIcon class="mt-2 w-16 h-16 text-primary" />
                <span class="text-center">
                    <h3 class="font-bold text-xl">{{ $t('store_limitedAccess') }}</h3>
                    <p>{{ $t('store_gainAccess') }}</p>
                </span>
                <BaseButton theme="secondary" @click="closeCta">
                    <template #icon>
                        <CheckIcon class="w-4 h-4" />
                    </template>
                    OK
                </BaseButton>
            </div>
        </BaseModal> -->
    </Loader>
</template>
<script lang="ts" setup>
import { 
    ShoppingCartIcon, 
    CheckIcon,
    ViewBoardsIcon,
} from "@heroicons/vue/solid";
import { SongListCard } from "@/components/songs";
import {
    ButtonGroup,
    SongFilterDropdown,
    SearchInput,
    SongFilterSelect,
} from "@/components/inputs";
import { BackButton, BaseModal } from "@/components";
import { LockClosedIcon } from "@heroicons/vue/outline";
import { appSession } from "@/services/session";
import { useRoute } from "vue-router";
import { computed, reactive, ref } from "vue";
import { MediaFile, Song } from "hiddentreasures-js";
import songService, { getList } from "@/services/songs/songService";
import fileService from "@/services/songs/fileService";
import { ListEntry } from "@/classes";
const collectionId = useRoute().params.collection as string;

const loading = ref(true);
const hasFiles = ref(false);

const collection = appSession.getCollection(collectionId);

const data = reactive({
    songs: null as ListEntry[] | null,
    files: null as MediaFile[] | null,
});

const songs = computed(() => data.songs);

songService.childrenOf(collection.id).then(r => {
    data.songs = getList("title", r, collection);
    fileService.retrieve({
        parentIds: r.map(i => i.id),
    }).then(f => {
        data.files = f;
        if (f.length) {
            hasFiles.value = true;
        }
        loading.value = false;
    });
});
</script>

<style lang="scss">
@keyframes fade-in {
    0% {opacity: 0;}
    100% {opacity: unset;}
}

.song-list {
    animation: fade-in 0.1s linear;
}
</style>
