<template>
    <base-dropdown :label="$t('common.open')">
        <div class="filter__header gap-x">
            <b>{{ $t("song.filters") }}</b>
            <base-button theme="primary" :action="apply">
                {{ $t("common.save") }}
            </base-button>
        </div>
        <div class="filter__wrapper gap-x" v-if="collection && !loading">
            <div class="grouping">
                <small>Video</small>
                <div class="filter gap-x" v-for="type in videoTypes" :key="type">
                    <input
                        v-model="videoValues[type]"
                        type="checkbox"
                        :name="type"
                        :id="`v-${type}`"
                    />
                    <label :for="`v-${type}`">
                        {{$t(`types.${type}`)}}
                    </label>
                </div>
            </div>
            <div class="grouping">
                <small>Audio</small>
                <div class="filter gap-x" v-for="type in audioTypes" :key="type">
                    <input
                        v-model="videoValues[type]"
                        type="checkbox"
                        :name="type"
                        :id="`a-${type}`"
                    />
                    <label :for="`a-${type}`">
                        {{$t(`types.${type}`)}}
                    </label>
                </div>
            </div>
            <div class="grouping">
                <small>Type</small>
                <div class="filter gap-x" v-for="type in songTypes" :key="type">
                    <input
                        v-model="typeValues[type]"
                        type="checkbox"
                        :name="type"
                        :id="`t-${type}`"
                    />
                    <label :for="`t-${type}`">
                        {{$t(`types.${type}`)}}
                    </label>
                </div>
            </div>
        </div>
    </base-dropdown>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import BaseDropdown from "./BaseDropdown.vue";
import BaseButton from "@/components/BaseButton.vue";

@Options({
    components: {
        BaseDropdown,
        BaseButton,
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
    private sessionStore = useStore(sessionKey);
    private store = useStore(songKey);
    public videoTypes = ["karaoke"];
    public audioTypes = ["gathering", "studio", "instrumental"];
    public songTypes = ["lyrics", "track", "sheetmusic"]
    public themes?: Theme[];
    public origins?: Origin[];

    public themeValues: {
        [id: string]: boolean;
    } = {};
    public originValues: {
        [id: string]: boolean;
    } = {};

    public audioValues: {
        [id: string]: boolean;
    } = {};
    public videoValues: {
        [id: string]: boolean;
    } = {};

    public typeValues: {
        [id: string]: boolean;
    } = {};


    public apply() {
        const themes =
            this.collection?.themes
                ?.filter((t) => this.themeValues[t.theme.id] == true)
                ?.map((t) => t.theme.id) ?? [];
        //const origins = this.collection?.origins?.filter(t => this.originValues[t.id] == true).map(t => t.id) ?? [];

        const videos = this.videoTypes.filter(
            (t) => this.videoValues[t] == true
        );
        const audio = this.audioTypes.filter(
            (t) => this.audioValues[t] == true
        );
        const types = this.songTypes.filter(
            (t) => this.typeValues[t] == true
        )

        const filter = Object.assign({}, this.store.state.filter);

        filter.themes = themes;
        filter.videoFiles = videos;
        filter.audioFiles = audio;
        filter.songTypes = types;
        //filter.origins = origins;

        this.store.commit("filter", filter);
    }

    public get languageKey() {
        return this.sessionStore.getters.languageKey;
    }

    public get loading() {
        return this.collection?.loading !== false;
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }
}
</script>

<style lang="scss">
.grouping {
    border: 1px dashed var(--st-border-color);
    border-radius: var(--st-border-radius);
    padding: calc(var(--st-spacing) * 0.5);
}

.filter__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filter__wrapper {
    display: flex;
    margin-top: calc(var(--st-spacing) * 0.5);

    .filter {
        display: flex;
        align-items: center;
    }
}
</style>