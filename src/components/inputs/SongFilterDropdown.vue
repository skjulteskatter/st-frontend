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
                <div class="filter gap-x">
                    <input
                        v-model="videoValues.karaoke"
                        type="checkbox"
                        name="karaoke"
                        id="v-karaoke"
                    />
                    <label for="v-karaoke">{{ $t("types.karaoke") }}</label>
                </div>
                <!-- <div class="filter gap-x">
                    <input v-model="videoValues.gathering" type="checkbox" name="gathering" id="v-gathering" />
                    <label for="v-gathering">{{$t('types.gathering')}}</label>
                </div>
                <div class="filter gap-x">
                    <input v-model="videoValues.studio" type="checkbox" name="complete" id="v-complete" />
                    <label for="v-complete">{{$t('types.studio')}}</label>
                </div> -->
            </div>
            <div class="grouping">
                <small>Audio</small>
                <!-- <div class="filter gap-x">
                    <input v-model="audioValues.karaoke" type="checkbox" name="karaoke" id="a-karaoke" />
                    <label for="a-karaoke">{{$t('types.karaoke')}}</label>
                </div> -->
                <div class="filter gap-x">
                    <input
                        v-model="audioValues.gathering"
                        type="checkbox"
                        name="gathering"
                        id="a-gathering"
                    />
                    <label for="a-gathering">{{ $t("types.gathering") }}</label>
                </div>
                <div class="filter gap-x">
                    <input
                        v-model="audioValues.studio"
                        type="checkbox"
                        name="studio"
                        id="a-studio"
                    />
                    <label for="a-studio">{{ $t("types.studio") }}</label>
                </div>
                <div class="filter gap-x">
                    <input
                        v-model="audioValues.instrumental"
                        type="checkbox"
                        name="instrumental"
                        id="a-instrumental"
                    />
                    <label for="a-instrumental">{{
                        $t("types.instrumental")
                    }}</label>
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
    public videoTypes = ["karaoke", "gathering", "studio", "instrumental"];
    public audioTypes = ["gathering", "studio", "instrumental"];
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

        const filter = Object.assign({}, this.store.state.filter);

        filter.themes = themes;
        filter.videoFiles = videos;
        filter.audioFiles = audio;
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