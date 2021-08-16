<template>
    <div
        class="w-full whitespace-pre-line mb-4"
        v-for="(verse, i) in text"
        :key="lyrics?.languageKey + verse.name + verse.content[0] + i"
    >
        <b class="text-sm">{{ verse.name }}</b>
        <p class="leading-7 w-max">{{ verse.content.join("\n") }}</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseModal } from "@/components";
import { useStore } from "@/store";
import { Song } from "@/classes";

@Options({
    name: "lyrics-viewer",
    props: {
        song: {
            type: Object,
        },
    },
    components: {
        BaseModal,
    },
})
export default class LyricsViewer extends Vue {
    public store = useStore();
    public song?: Song;

    public get text() {
        return this.lyrics?.getText({
            chorus: this.$t("song.chorus"),
            bridge: this.$t("song.bridge"),
        }) ?? [];
    }

    public get lyrics() {
        return this.store.getters.lyrics;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collection() {
        return this.store.getters.collection;
    }
}
</script>
