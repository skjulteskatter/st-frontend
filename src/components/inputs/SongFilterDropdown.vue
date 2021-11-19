<template>
    <BaseDropdown origin="right" v-if="collection && !loading">
        <template #button>
            <button class="p-2 flex gap-2 items-center rounded-md text-sm border border-black/20 bg-white dark:bg-secondary dark:border-white/20 relative">
                Filter
                <AdjustmentsIcon class="w-4 h-4" />
                <div v-if="filtersActive">
                    <span class="w-3 h-3 rounded-full bg-primary z-20 absolute -top-1 -right-1"></span>
                    <span class="w-3 h-3 rounded-full bg-primary z-20 absolute -top-1 -right-1 animate-ping"></span>
                </div>
            </button>
        </template>
        <template #header>
            <div class="flex justify-between items-baseline gap-2">
                <h3 class="font-bold">{{ $t('song_filterByContent') }}</h3>
                <button class="text-red-700 hover:underline" @click="removeFilters" v-if="filtersActive">{{ $t('common_remove') }}</button>
            </div>
        </template>
        <div class="w-72 flex flex-col gap-6">
            <label class="flex items-center">
                <input
                    v-model="typeValues.lyrics"
                    type="checkbox"
                    name="lyrics"
                    id="lyrics"
                    class="mr-2 border-gray-300 rounded text-primary focus:ring-primary"
                    @change="apply()"
                />
                <span>{{ $t("types_lyrics") }}</span>
            </label>
            <CheckboxGroup :name="$t('types_video')" :labels="videoTypes" :values="videoValues" :action="apply" />
            <CheckboxGroup :name="$t('types_sheetmusic')" :labels="sheetMusicTypes" :values="sheetMusicValues" :action="apply" />
            <CheckboxGroup :name="$t('types_audio')" :labels="audioTypes" :values="audioValues" :action="apply" />
        </div>
    </BaseDropdown>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import CheckboxGroup from "./CheckboxGroup.vue";
import { AdjustmentsIcon } from "@heroicons/vue/solid";

@Options({
    name: "song-filter-dropdown",
    components: {
        CheckboxGroup,
        AdjustmentsIcon,
    },
    emits: ["apply"],
})
export default class SongFilterDropdown extends Vue {
    private store = useStore();
    public videoTypes = ["karaoke"];
    public audioTypes = [
        "gathering",
        "studio",
        "instrumental",
        "live_performance",
        "demo",
        "playback",
    ];
    public contentTypes = ["lyrics", "audio", "video", "sheetmusic"];
    public sheetMusicTypes = ["leadsheet", "5part"];

    public audioValues: {
        [id: string]: boolean;
    } = {};
    public videoValues: {
        [id: string]: boolean;
    } = {};

    public sheetMusicValues: {
        [id: string]: boolean;
    } = {};
    public typeValues: {
        [id: string]: boolean;
    } = {};

    public mounted() {
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
    }

    public removeFilters() {
        this.audioValues = {};
        this.videoValues = {};
        this.typeValues = {};
        this.sheetMusicValues = {};

        this.apply();
    }

    public apply() {
        const videos = this.videoTypes.filter(
            (t) => this.videoValues[t] == true,
        );
        const audio = this.audioTypes.filter(
            (t) => this.audioValues[t] == true,
        );
        const types = this.contentTypes.filter(
            (t) => this.typeValues[t] == true,
        );

        const filter = this.store.state.songs.filter;

        filter.videoFiles = videos;
        filter.audioFiles = audio;
        filter.contentTypes = types;
        filter.sheetMusicTypes = this.sheetMusicTypes.filter(
            (t) => this.sheetMusicValues[t] == true,
        );

        this.store.commit(SongsMutationTypes.SET_FILTER, filter);
        this.$emit("apply");
    }

    public get filtersActive() {
        let count = 0;

        count += Object.keys(this.audioValues).length;
        count += Object.keys(this.videoValues).length;
        count += Object.keys(this.sheetMusicValues).length;
        count += Object.keys(this.typeValues).length;

        return count != 0;
    }

    public get loading() {
        return this.collection?.loading !== false;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>
