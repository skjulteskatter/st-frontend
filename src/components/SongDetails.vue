<template>
    <base-card class="song-details__lyrics" v-if="song">
        <div
            v-for="(verse, i) in text"
            :key="verse.name + verse.content[0] + i"
        >
            <b>{{ verse.name }}</b>
            <p v-for="line in verse.content" :key="line">{{ line }}</p>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseCard from "@/components/BaseCard.vue";
import Modal from "@/components/Modal.vue";
import { Lyrics, Song } from "@/classes";

@Options({
    components: {
        BaseCard,
        Modal,
    },
    props: {
        lyrics: {
            type: Object,
        },
        languageKey: {
            type: String,
        },
        song: {
            type: Object,
        },
    },
})
export default class SongDetails extends Vue {
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public lyrics?: Lyrics;
    public languageKey = "";
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
.song-details {
    &__lyrics {
        width: 100%;
        flex-grow: 1;
    }

    // &__files {
    //     .card__content {
    //         .files__container {
    //             display: flex;
    //             flex-direction: column;
    //         }
    //     }

    //     figure {
    //         margin: 0 0 0.5em 0;
    //     }
    // }
}
</style>