<template>
    <div class="song-details" v-if="song">
        <base-card class="song-details__lyrics">
            <div v-for="(verse, i) in text" :key="verse.name + verse.content[0] + i">
                <b>{{ verse.name }}</b>
                <p v-for="line in verse.content" :key="line">{{ line }}</p>
            </div>
        </base-card>
    </div>
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
        }
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

<style lang="scss">
#biography img {
    max-width: 100%;
}

.biography-wrapper {
    color: var(--st-text-color);

    img {
        width: 100%;
    }
}

.song-details {
    --half-spacing: calc(var(--st-spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: var(--st-spacing);

    &__lyrics {
        grid-column: span 4;
    }

    &__files {
        grid-column: span 2;

        &__video {
            &__link {
                text-decoration: none;
                color: var(--st-primary-color);
            }
        }

        .card__content {
            .files__container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-gap: var(--st-spacing);
            }
        }

        figure {
            margin: 0 0 0.5em 0;
        }
    }

    &__metadata {
        grid-column: span 6;

        &__credits {
            display: inline-block;
            color: var(--st-primary-color);

            span {
                display: inline-block;
                margin-right: var(--half-spacing);
            }
        }

        .card__content {
            h2 {
                margin: 0 0 var(--st-spacing);
            }

            .tag {
                display: inline-block;
                margin: 0;
            }
        }
    }
}
</style>