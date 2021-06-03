<template>
    <div v-if="tag != undefined" class="tag-view">
        <h1>{{getLocaleString(tag.name)}}</h1>
        <div v-for="song in songs" :key="song.id">{{song.getName(languageKey)}}</div>
    </div>
</template>
<script lang="ts">
import { Song } from "@/classes";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "tag-view",
})
export default class TagVue extends Vue {
    private store = useStore();
    public tag?: SongTag = undefined;
    public songs: Song[] = [];

    public async beforeMount() {
        this.tag = appSession.tags.find(t => t.id == this.$route.params.id);

        this.songs = appSession.songs.filter(t => t.tagIds.includes(this.tag?.id ?? ""));
    }

    public getLocaleString(dictionary: { [key: string]: string }) {
        return (
            dictionary[this.languageKey] ??
            dictionary.en ??
            dictionary[Object.keys(dictionary)[0]]
        );
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
