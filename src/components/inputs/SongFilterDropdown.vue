<template>
    <BaseDropdown origin="right" v-if="collection && !loading">
        <template #button>
            <div class="text-sm bg-white p-2 rounded-md border border-black/20 flex items-center gap-2 dark:bg-secondary dark:border-white/20 relative">
                Filter
                <AdjustmentsIcon class="w-4 h-4" />
                <div v-if="filtersActive">
                    <span class="w-3 h-3 rounded-full bg-primary z-20 absolute -top-1 -right-1"></span>
                    <span class="w-3 h-3 rounded-full bg-primary z-20 absolute -top-1 -right-1 animate-ping"></span>
                </div>
            </div>
        </template>
        <template #header>
            <div class="flex justify-between items-baseline gap-2">
                <h3 class="font-bold">{{ $t('song_filterByContent') }}</h3>
                <button class="text-red-700 rounded-md py-1 px-2 text-sm hover:bg-red-500/10" @click="removeFilters" v-if="filtersActive">{{ $t('common_remove') }}</button>
            </div>
        </template>
        <div class="w-72 flex flex-col gap-6">
            <label class="flex items-center">
                <input
                    v-model="typeValues.lyrics"
                    type="checkbox"
                    name="lyrics"
                    id="lyrics"
                    class="mr-2 border-gray-300 rounded text-primary focus-visible:ring-primary"
                    @change="apply()"
                />
                <span>{{ $t("types_lyrics") }}</span>
            </label>
            <CheckboxGroup :name="$t('types_video')" :labels="typeLabels(videoTypes)" :values="videoValues" :action="apply" />
            <CheckboxGroup :name="$t('types_sheetmusic')" :labels="typeLabels(sheetMusicTypes)" :values="sheetMusicValues" :action="apply" />
            <CheckboxGroup :name="$t('types_audio')" :labels="typeLabels(audioTypes)" :values="audioValues" :action="apply" />
            <CheckboxGroup v-if="categoryTypes.length > 0" :name="$t('song_category')" :labels="categoryTypes" :values="categoryValues" :action="apply"/>
        </div>
    </BaseDropdown>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Collection, Song } from "@/classes";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import CheckboxGroup from "./CheckboxGroup.vue";
import { AdjustmentsIcon } from "@heroicons/vue/solid";
import SongFilter from "@/classes/songFilter";
import { appSession } from "@/services/session";

export default defineComponent({
    name: "song-filter-dropdown",
    components: {
        CheckboxGroup,
        AdjustmentsIcon,
    },
    props: {
        songs: {
            type: Array as PropType<Song[]>,
            required: true,
        },
    },
    emits: ["apply"],
    data: () => ({
        store: useStore(),
        videoTypes: ["karaoke", "tutorial"],
        audioTypes: [
            "gathering",
            "studio",
            "instrumental",
            "live_performance",
            "demo",
            "playback",
        ],
        contentTypes: ["lyrics", "audio", "video", "sheetmusic"],
        sheetMusicTypes: ["leadsheet", "5part"],
        categoryTypes: [] as {key: string; title: string}[],
        audioValues: {} as {
            [id: string]: boolean;
        },
        videoValues: {} as {
            [id: string]: boolean;
        },
        sheetMusicValues: {} as {
            [id: string]: boolean;
        },
        typeValues: {} as {
            [id: string]: boolean;
        },
        categoryValues: {} as {
            [id: string]: boolean;
        },
    }),
    computed: {
        filtersActive() {
            const allFilters = [
                ...Object.keys(this.audioValues),
                ...Object.keys(this.videoValues),
                ...Object.keys(this.sheetMusicValues),
                ...Object.keys(this.typeValues),
            ];
            return allFilters.length > 0;
        },
        loading() {
            return this.collection?.loading !== false;
        },
        collection(): Collection | undefined {
            return this.store.getters.collection as Collection;
        },
    },
    mounted() {
        this.categoryTypes = appSession.categories.filter(c => this.songs.some(s => s.categoryIds.includes(c.id))).map(i => {
            return {
                key: i.id,
                title: i.name.default,
            };
        });
        const filter = Object.assign({}, this.store.state.songs.filter);

        for (const t of filter.audioFiles) {
            this.audioValues[t] = true;
        }

        for (const t of filter.videoFiles) {
            this.videoValues[t] = true;
        }

        for (const t of filter.sheetMusicTypes) {
            this.sheetMusicValues[t] = true;
        }

        for (const t of filter.contentTypes) {
            this.typeValues[t] = true;
        }

        for (const c of filter.categoryIds) {
            this.categoryValues[c] = true;
        }
        

        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("category");
        if (categoryId) {
            this.categoryValues[categoryId] = true;

            this.apply();

            this.$router.replace({query: undefined});
        }

    },
    methods: {
        removeFilters() {
            this.audioValues = {};
            this.videoValues = {};
            this.typeValues = {};
            this.sheetMusicValues = {};
            this.apply();
        },
        apply() {
            const videos = this.videoTypes.filter(
                (t) => this.videoValues[t] == true,
            );
            const audio = this.audioTypes.filter(
                (t) => this.audioValues[t] == true,
            );
            const types = this.contentTypes.filter(
                (t) => this.typeValues[t] == true,
            );
            const sheetMusic = this.sheetMusicTypes.filter(
                (t) => this.sheetMusicValues[t] == true,
            );
            const categories = this.categoryTypes.filter(
                (i) => this.categoryValues[i.key] === true,
            ).map(i => i.key);

            const filter = this.store.state.songs.filter as SongFilter;
            filter.videoFiles = videos;
            filter.audioFiles = audio;
            filter.contentTypes = types;
            filter.sheetMusicTypes = sheetMusic;
            filter.categoryIds = categories;

            this.store.commit(SongsMutationTypes.SET_FILTER, filter);
            this.$emit("apply");
        },
        typeLabels(types: string[]) {
            return types.map(type => {
                return {
                    key: type,
                    title: this.$t(`types_${type}`),
                };
            });
        },
    },
});
</script>
