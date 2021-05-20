<template>
    <div
        class="lyrics-viewer"
        v-for="(verse, i) in text"
        :key="lyrics?.languageKey + verse.name + verse.content[0] + i"
    >
        <b>{{ verse.name }}</b>
        <p class="lyrics-viewer__verse">{{ verse.content.join("\n") }}</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, Modal } from "@/components";
import { useStore } from "@/store";

@Options({
    name: "lyrics-viewer",
    components: {
        BaseCard,
        Modal,
    },
})
export default class LyricsViewer extends Vue {
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;

    public get text() {
        const verses: { name: string; content: string[] }[] = [];

        const types: {
            [key: string]: string;
        } = {
            "[Chorus]": "chorus",
            "[Bridge]": "bridge",
        };

        if (this.lyrics) {
            for (const key of Object.keys(this.lyrics.content)) {
                const verse: Verse = {
                    name: (this.lyrics.content as JsonContent)[key].name,
                    content: (this.lyrics.content as JsonContent)[key].content,
                    type:
                        types[(this.lyrics.content as JsonContent)[key].name] ??
                        "verse",
                };

                if (verse.type == "chorus") {
                    verse.name = this.$t("song.chorus");
                } else if (verse.type == "bridge") {
                    verse.name = this.$t("song.bridge");
                }

                verses.push(verse);
            }
        }

        return verses;
    }

    public get lyrics() {
        return useStore().getters.lyrics;
    }
}
</script>

<style lang="scss" scoped>
.lyrics-viewer {
    width: 100%;
    flex-grow: 1;
    line-height: 0.9em;
    margin-bottom: calc(var(--st-spacing) * 2);
    white-space: pre-line;

    &__verse {
        line-height: 2;
    }
}
</style>
