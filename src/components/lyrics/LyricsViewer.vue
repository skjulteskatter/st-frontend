<template>
    <div
        class="w-full whitespace-pre-line mb-4"
        v-for="(verse, i) in text"
        :key="lyrics?.languageKey + verse.name + verse.content[0] + i"
    >
        <b>{{ verse.name }}</b>
        <p class="leading-7">{{ verse.content.join("\n") }}</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Modal } from "@/components";
import { useStore } from "@/store";

@Options({
    name: "lyrics-viewer",
    components: {
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
