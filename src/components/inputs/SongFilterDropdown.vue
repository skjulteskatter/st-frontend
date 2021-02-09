<template>
    <base-dropdown :label="$t('common.open')">
        <b>{{ $t("song.filters") }}</b>
        <div class="filter__wrapper gap-x" v-if="collection && !loading">
            <div class="grouping">
                <small>Video</small>
                <div class="filter gap-x">
                    <input type="checkbox" name="video" id="video" />
                    <label for="video">Karaoke</label>
                </div>
            </div>
            <div class="grouping">
                <small>Lyd</small>
            </div>
            <div class="grouping" v-if="themes">
                <small>{{ $t("song.themes") }}</small>
                <div class="filter gap-x" v-for="theme in collection.themes" :key="theme.theme.id">
                    <input v-model="themeValues[theme.theme.id]" type="checkbox" :name="theme.theme.name[languageKey]" :id="theme.theme.id"/>
                    <label :for="theme.theme.id">{{theme.theme.name[languageKey]}}</label>
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
        }
    }
})
export default class SongFilterDropdown extends Vue {
    private sessionStore = useStore(sessionKey);
    private store = useStore(songKey);
    public videoTypes = ["karaoke", "complete_arrangement"];
    public audioTypes = ["karaoke", "gathering", "complete_arrangement"];
    public themes?: Theme[];

    public themeValues: {
        [id: string]: boolean;
    } = {};

    public apply() {
        const themes = this.collection?.themes?.filter(t => this.themeValues[t.theme.id] == true)?.map(t => t.theme.id) ?? [];

        const filter = Object.assign({}, this.store.state.filter);

        filter.themes = themes;

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