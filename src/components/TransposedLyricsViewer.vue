<template>
    <div v-if="song">
        <div v-if="lyrics && lyrics.format == 'html'" class="transposed-lyrics-button-list">
            <base-button v-for="t in Object.keys(transpositions)" :key="t" @click="transpose(transpositions[t])">{{t}}</base-button>
        </div>

        <base-card v-if="lyrics && lyrics.format == 'html'" border>
            <div v-html="lyrics.transposedContent"></div>
        </base-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseCard, BaseButton, Modal } from "@/components";
import { Collection, Song } from "@/classes";
import { useStore } from "vuex";
import { songKey } from "@/store";

@Options({
    components: {
        BaseCard,
        BaseButton,
        Modal,
    },
    props: {
        languageKey: {
            type: String,
        },
        song: {
            type: Object,
        },
    },
})
export default class TransposedLyricsViewer extends Vue {
    private songStore = useStore(songKey);
    public selectVerses: string[] = [];
    public currentVerseNumber = 0;
    public description = "";
    public languageKey = "";
    public title = "";
    public song?: Song;

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.name[this.languageKey] ??
            this.song?.melodyOrigin?.name.no ??
            undefined
        );
    }

    public get lyrics() {
        return this.songStore.state.transposedLyrics;
    }

    public get transpositions() {
        return this.lyrics?.transpositions ?? {};
    }

    public async transpose(to: number) {
        if (this.song) {
            const lyrics = await this.collection?.transposeLyrics(
                this.song.number,
                to
            );
            this.songStore.commit("transposedLyrics", lyrics);
        }
    }

    public get collection(): Collection | undefined {
        return this.songStore.getters.collection;
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
        max-width: 50%;
    }
}

.transposed-lyrics-button-list {
    display: flex;
}

.song-details {
    --half-spacing: calc(var(--st-spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: var(--st-spacing);

    &__metadata {
        grid-column: span 4;

        &__credits {
            display: inline-block;
            margin: 0 0 0 var(--st-spacing);
            color: var(--st-primary-color);
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

    &__controls {
        grid-column: span 2;

        .card__content {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: var(--st-spacing);
        }

        &__title {
            margin: 0;
            grid-column: span 2;
        }

        &__update {
            font-size: 1em;
            padding: var(--st-spacing);
        }

        &__open {
            font-size: 1em;
        }
    }

    &__verses {
        display: flex;

        &__title {
            margin-top: 0;
        }

        &__input {
            border-radius: var(--st-border-radius);
            overflow: hidden;
            font-size: 1.1em;

            display: flex;
            align-items: center;

            &__check {
                display: none;

                &:checked + span {
                    color: white;
                    background: var(--st-primary-color);
                }
            }

            &__label {
                width: 100%;
                padding: var(--half-spacing);
                background: var(--st-secondary-background-color);
                color: var(--st-text-color);
                user-select: none;
            }

            &:not(:last-child) {
                margin-bottom: 0.5em;
            }
        }
    }
}
</style>