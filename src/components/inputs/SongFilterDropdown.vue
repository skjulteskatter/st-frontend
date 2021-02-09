<template>
    <base-dropdown :label="$t('common.open')">
        <b>{{ $t("song.filters") }}</b>
        <div class="filter__wrapper gap-x" v-if="collection && !loading">
            <div class="grouping">
                <small>Video</small>
                <div class="filter gap-x">
                    <input v-model="videoValues.karaoke" type="checkbox" name="karaoke" id="karaoke" />
                    <label for="karaoke">Karaoke</label>
                </div>
                <div class="filter gap-x">
                    <input v-model="videoValues.gathering" type="checkbox" name="gathering" id="gathering" />
                    <label for="gathering">Samling</label>
                </div>
                <div class="filter gap-x">
                    <input v-model="videoValues.complete_arrangement" type="checkbox" name="complete" id="complete" />
                    <label for="complete">Komplett</label>
                </div>
            </div>
            <div class="grouping">
                <small>Audio</small>
                <div class="filter gap-x">
                    <input v-model="audioValues.karaoke" type="checkbox" name="karaoke" id="karaoke" />
                    <label for="karaoke">Karaoke</label>
                </div>
                <div class="filter gap-x">
                    <input v-model="audioValues.gathering" type="checkbox" name="gathering" id="gathering" />
                    <label for="gathering">Samling</label>
                </div>
                <div class="filter gap-x">
                    <input v-model="audioValues.complete_arrangement" type="checkbox" name="complete" id="complete" />
                    <label for="complete">Komplett</label>
                </div>
            </div>
            <button @click="apply">APPLY</button>
        </div>
    </base-dropdown>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { sessionKey, songKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import BaseDropdown from "./BaseDropdown.vue";

@Options({
    components: {
        BaseDropdown,
    },
    props: {
        themes: {
            type: Array,
        },
        origins: {
            type: Array,
        }
    }
})
export default class SongFilterDropdown extends Vue {
    private sessionStore = useStore(sessionKey);
    private store = useStore(songKey);
    public videoTypes = ["karaoke", "gathering", "complete_arrangement"];
    public audioTypes = ["karaoke", "gathering", "complete_arrangement"];
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
        const themes = this.collection?.themes?.filter(t => this.themeValues[t.theme.id] == true)?.map(t => t.theme.id) ?? [];
        //const origins = this.collection?.origins?.filter(t => this.originValues[t.id] == true).map(t => t.id) ?? [];

        const videos = this.videoTypes.filter(t => this.videoValues[t] == true);
        console.log(videos);
        const audio = this.audioTypes.filter(t => this.audioValues[t] == true);

        const filter = Object.assign({}, this.store.state.filter);

        filter.themes = themes;
        filter.videoFiles = videos;
        filter.audioFiles = audio;
        //filter.origins = origins;

        this.store.commit('filter', filter)
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

.filter__wrapper {
    display: flex;
    margin-top: calc(var(--st-spacing) * 0.5);

    .filter {
        display: flex;
        align-items: center;
    }
}
</style>