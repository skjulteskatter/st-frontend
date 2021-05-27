<template>
    <base-dropdown :label="$t('common.select')">
        <div class="flex justify-between items-center gap-2">
            <b>{{ $t("song.showsongswith") }}...</b>
            <base-button theme="primary" @click="apply">
                {{ $t("song.apply") }}
            </base-button>
        </div>
        <div class="flex gap-2 w-72" v-if="collection && !loading">
            <div class="flex-grow">
                <div class="py-2">
                    <input
                        v-model="typeValues.lyrics"
                        type="checkbox"
                        name="lyrics"
                        id="lyrics"
                        class="mr-2"
                    /><label for="lyrics">
                        <strong>
                            {{ $t("types.lyrics") }}
                        </strong>
                    </label>
                </div>
                <div class="py-2">
                    <input
                        v-model="typeValues.video"
                        type="checkbox"
                        name="video"
                        id="video"
                        class="mr-2"
                    /><label for="video">
                        <strong>
                            {{ $t("types.video") }}
                        </strong>
                    </label>
                    <div
                        class="ml-2 flex items-center gap-2"
                        v-for="type in videoTypes"
                        :key="type"
                    >
                        <input
                            v-model="videoValues[type]"
                            type="checkbox"
                            :name="type"
                            :id="`v-${type}`"
                        />
                        <label :for="`v-${type}`">
                            {{ $t(`types.${type}`) }}
                        </label>
                    </div>
                </div>
                <div class="py-2">
                    <input
                        v-model="typeValues.sheetmusic"
                        type="checkbox"
                        name="sheetmusic"
                        id="sheetmusic"
                        class="mr-2"
                    /><label for="sheetmusic">
                        <strong>
                            {{ $t("types.sheetmusic") }}
                        </strong>
                    </label>
                    <div
                        class="ml-2 flex items-center gap-2"
                        v-for="type in sheetMusicTypes"
                        :key="type"
                    >
                        <input
                            v-model="sheetMusicValues[type]"
                            type="checkbox"
                            :name="type"
                            :id="`sm-${type}`"
                        />
                        <label :for="`sm-${type}`">
                            {{ $t(`types.${type}`) }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="flex-grow">
                <div class="py-2">
                    <input
                        v-model="typeValues.audio"
                        type="checkbox"
                        name="audio"
                        id="audio"
                        class="mr-2"
                    /><label for="audio">
                        <strong>
                            {{ $t("types.audio") }}
                        </strong>
                    </label>
                    <div
                        class="ml-2 flex items-center gap-2"
                        v-for="type in audioTypes"
                        :key="type"
                    >
                        <input
                            v-model="audioValues[type]"
                            type="checkbox"
                            :name="type"
                            :id="`a-${type}`"
                        />
                        <label :for="`a-${type}`">
                            {{ $t(`types.${type}`) }}
                        </label>
                    </div>
                </div>
            </div>
            <!-- <div class="py-2">
                <small>Type</small>
                <div class="filter gap-x" v-for="type in contentTypes" :key="type">
                    <input
                        v-model="typeValues[type]"
                        type="checkbox"
                        :name="type"
                        :id="`t-${type}`"
                    />
                    <label :for="`t-${type}`">
                        {{ $t(`types.${type}`) }}
                    </label>
                </div>
            </div> -->
        </div>
    </base-dropdown>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { Options, Vue } from "vue-class-component";
import BaseDropdown from "./BaseDropdown.vue";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";

@Options({
    name: "song-filter-dropdown",
    components: {
        BaseDropdown,
    },
    props: {
        themes: {
            type: Array,
        },
        origins: {
            type: Array,
        },
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
        // const themes =
        //     this.collection?.themes
        //         ?.filter((t) => this.themeValues[t.theme.id] == true)
        //         ?.map((t) => t.theme.id) ?? [];
        //const origins = this.collection?.origins?.filter(t => this.originValues[t.id] == true).map(t => t.id) ?? [];

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
        //filter.origins = origins;

        this.store.commit(SongsMutationTypes.SET_FILTER, filter);
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
