<template>
    <div class="flex gap-2 text-sm">
        <base-dropdown :label="$t('types.lyrics')" origin="left">
            <div class="w-72" v-if="collection && !loading">
                <label class="font-bold">
                    <input
                        v-model="typeValues.lyrics"
                        type="checkbox"
                        name="lyrics"
                        id="lyrics"
                        class="mr-2 border-gray-300 rounded text-primary focus:ring-primary"
                    />
                    {{ $t("types.lyrics") }}
                </label>
            </div>
        </base-dropdown>
        <base-dropdown :label="$t('types.video')" origin="left">
            <div class="w-72" v-if="collection && !loading">
                <checkbox-group :name="$t('types.video')" :labels="videoTypes" :values="videoValues" />
            </div>
        </base-dropdown>
        <base-dropdown :label="$t('types.sheetmusic')" origin="left">
            <div class="w-72" v-if="collection && !loading">
                <checkbox-group :name="$t('types.sheetmusic')" :labels="sheetMusicTypes" :values="sheetMusicValues" />
            </div>
        </base-dropdown>
        <base-dropdown :label="$t('types.audio')" origin="left">
            <div class="w-72" v-if="collection && !loading">
                <checkbox-group :name="$t('types.audio')" :labels="audioTypes" :values="audioValues" />
            </div>
        </base-dropdown>
        <base-button theme="secondary" @click="apply()">{{ $t('song.apply') }}</base-button>
    </div>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import CheckboxGroup from "./CheckboxGroup.vue";

@Options({
    name: "song-filter-dropdown",
    props: {
        themes: {
            type: Array,
        },
        origins: {
            type: Array,
        },
    },
    components: {
        CheckboxGroup,
    },
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
    public themes?: Theme[];
    public origins?: Origin[];

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

        const filter = Object.assign({}, this.store.state.songs.filter);

        filter.videoFiles = videos;
        filter.audioFiles = audio;
        filter.contentTypes = types;
        filter.sheetMusicTypes = this.sheetMusicTypes.filter(
            (t) => this.sheetMusicValues[t] == true,
        );

        this.store.commit(SongsMutationTypes.SET_FILTER, filter);
    }

    public get filtersActive() {
        return false;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get loading() {
        return this.collection?.loading !== false;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>
