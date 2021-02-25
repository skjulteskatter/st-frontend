<template>
    <div
        class="lyrics-viewer"
        v-for="(verse, i) in text"
        :key="verse.name + verse.content[0] + i"
    >
        <b>{{ verse.name }}</b>
        <p v-for="line in verse.content" :key="line">{{ line }}</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, Modal, BaseButton } from "@/components";
import { Lyrics, Song } from "@/classes";

@Options({
    components: {
        BaseCard,
        Modal,
        BaseButton,
    },
    props: {
        lyrics: {
            type: Object,
        },
        song: {
            type: Object,
        },
    },
})
export default class LyricsViewer extends Vue {
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public lyrics?: Lyrics;
    public song?: Song;

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
}
</script>

<style lang="scss" scoped>
.lyrics-viewer {
    width: 100%;
    flex-grow: 1;
}
</style>