<template>
    <div class="lyrics-content">
        <div
            class="flex-col w-full whitespace-pre-line mb-4"
            v-for="(verse, i) in text"
            :key="i"
        >
            <b class="text-sm">{{ verse.name }}</b>
            <p class="leading-7" v-for="(line, i) in verse.content" :key="i">{{ line }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseModal } from "@/components";
import { useStore } from "@/store";
import { Lyrics } from "@/classes";

@Options({
    name: "lyrics-viewer",
    props: {
        lyrics: {
            type: Object,
        },
    },
    components: {
        BaseModal,
    },
})
export default class LyricsViewer extends Vue {
    public store = useStore();
    public lyrics?: Lyrics;

    public get text() {
        return this.lyrics?.getText({
            chorus: this.$t("song_chorus"),
            bridge: this.$t("song_bridge"),
        }) ?? [];
    }
}
</script>
<style lang="scss">
.lyrics-content {
	column-count: 1;

    @media screen and (min-width: 600px) {
        column-count: 2;
    }
}

.lyrics-content > div {
	break-inside: avoid;
}
</style>
