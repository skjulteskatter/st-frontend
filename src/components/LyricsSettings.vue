<template>
    <div class="lyrics-settings">
        <card class="lyrics-settings__verses" border>
            <h2 class="lyrics-settings__verses__title">Verses</h2>
            <label class="lyrics-settings__verses__input" v-for="verse in verses" :key="verse.type + verse.number" @click="toggleSelection(verse)">
                <input :id="verse.type + verse.number" type="checkbox" class="lyrics-settings__verses__input__check" checked>
                <span :for="verse.type + verse.number" class="lyrics-settings__verses__input__label" :class="{'selected': verse.selected}">{{ verse.type + " " + verse.number }}</span>
            </label>
        </card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics } from '@/classes';
import Card from  '@/components/Card.vue';

@Options({
    props: {
        lyrics: {
            type: Object,
            default: {}
        }
    },
    components: {
        Card
    }
})
export default class LyricsSettings extends Vue {
    public lyrics: Lyrics = {} as Lyrics;
    //public verses: Verse[] = [];
    private selectedVerses: Verse[] = [];

    public mounted() {
        this.selectedVerses = Object.assign([], this.lyrics.verses)
    }

    public toggleSelection(verse: Verse) {
        if (this.selectedVerses.find(v => v.number == verse.number && v.type == verse.type)) {
            this.selectedVerses = this.selectedVerses.filter(v => v.number != verse.number || v.type != verse.type);
        } else {
            this.selectedVerses.push(verse);
        }
        this.selectedVerses = this.selectedVerses.sort((a, b) => a.id - b.id);
    }

    public get verses() {
        return this.lyrics.verses;
    }
}
</script>

<style lang="scss">
.lyrics-settings {
    --half-spacing: calc(var(--spacing) * 0.5);

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing);

    &__verses {
        display: flex;

        &__title {
            margin-top: 0;
        }

        &__input {
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            overflow: hidden;
            font-size: 1.1em;
            display: flex;
            align-items: center;

            &__check {
                display: none;

                &:checked + span {
                    color: white;
                }
            }

            &__label {
                width: 100%;
                background: white;
                color: var(--border-color);
                padding: var(--half-spacing);
                user-select: none;

                &.selected {
                    background: var(--primary-color);
                }
            }

            &:not(:last-child) {
                margin-bottom: .5em;
            }
        }
    }
}
</style>