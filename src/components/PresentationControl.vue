<template>
    <div class="flex flex-col gap-4" v-if="song && lyrics">
        <base-card class="ring-1 ring-primary">
            <template #header>
                <h3 class="font-bold">
                    {{ $t("song.viewer") }}
                </h3>
            </template>
            <div class="flex flex-col items-center gap-2 py-4">
                <base-button
                    theme="primary"
                    @click="open()"
                >
                    {{ $t("song.openviewer") }}
                </base-button>
                <base-button
                    theme="tertiary"
                    @click="refresh()"
                >
                    <template #icon>
                        <RefreshIcon class="w-4 h-4" />
                    </template>
                    {{ $t("song.updateviewer") }}
                </base-button>
            </div>
            <template #footer>
                <h4 class="tracking-wider uppercase text-xs opacity-50 mb-2">
                    {{ $t("song.controlpanel") }}
                </h4>
                <div class="flex gap-2">
                    <base-button
                        class="flex-grow"
                        @click="previous"
                        theme="secondary"
                    >
                        <template #icon>
                            <ArrowSmLeftIcon class="w-4 h-4" />
                        </template>
                        {{ $t("common.previous") }} {{ $t('song.verse').toLocaleLowerCase() }}
                    </base-button>
                    <base-button
                        class="flex-grow"
                        @click="next"
                        theme="secondary"
                    >
                        <template #icon>
                            <ArrowSmRightIcon class="w-4 h-4" />
                        </template>
                        {{ $t("common.next") }} {{ $t('song.verse').toLocaleLowerCase() }}
                    </base-button>
                </div>
            </template>
        </base-card>
        <!-- <base-card
            v-if="song.type == 'lyrics'"
            class="lyrics-settings__controls"
        >
            <h4 class="lyrics-settings__controls__title">
                {{ $t("song.controlpanel") }}
            </h4>
            <div class="lyrics-settings__controls__buttons">
                <base-button
                    class="lyrcis-settings__controls__previous"
                    icon="arrowLeft"
                    @click="previous"
                    theme="secondary"
                >
                    {{ $t("common.previous") }}
                </base-button>
                <base-button
                    class="lyrcis-settings__controls__next"
                    @click="next"
                    theme="secondary"
                    icon="arrowRight"
                >
                    {{ $t("common.next") }}
                </base-button>
            </div> -->
            <!-- <div v-if="song.type == 'lyrics'" class="lyrics-settings__controls__verses">
                <h5 class="lyrics-settings__verses__title">
                    {{ $t("common.show") }} / {{ $t('common.hide') }}
                </h5>
                <div
                    class="lyrics-settings__verses__select gap-x"
                    v-for="key in verseSelect"
                    :key="key"
                >
                    <input
                        v-model="selectVerses[key]"
                        type="checkbox"
                        :name="key"
                        :id="key"
                    />
                    <label :for="key">
                        {{ verses[key]?.name }}
                    </label>
                </div>
            </div> -->
        <!-- </base-card> -->
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics, Song } from "@/classes";
import { control } from "@/classes/presentation/control";
import { RefreshIcon, ArrowSmLeftIcon, ArrowSmRightIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        RefreshIcon,
        ArrowSmLeftIcon,
        ArrowSmRightIcon,
    },
    props: {
        lyrics: {
            type: Object,
        },
        languageKey: {
            type: String,
            default: "",
        },
        song: {
            type: Object,
        },
    },
    name: "presentation-control",
})
export default class PresentationControl extends Vue {
    public selectVerses: {
        [key: string]: boolean;
    } = {};
    public currentVerseNumber = 0;
    public currentLinesNumber = 0;
    public lyrics?: Lyrics;
    public languageKey?: string;
    public song?: Song;

    public lineSize = 2;

    public mounted() {
        control.init();
    }

    public open() {
        this.refresh();
        window.open("/presentation", "SongTreasures - Presentation View", "resizeable,scrollbars");
    }

    public refresh() {
        if (this.lyrics) {
            
            control.setLyrics(this.lyrics, {
                size: this.lyrics.size <= 5 ? 2 : 1,
                availableVerses: Object.keys(this.lyrics.verses),
                currentIndex: 0,
            });
        }
    }

    public next() {
        control.next();
    }

    public previous() {
        control.previous();
    }
}
</script>

<style lang="scss">
.lyrics-settings {
    --half-spacing: calc(var(--st-spacing) * 0.5);
    flex-shrink: 0;

    display: flex;
    flex-direction: column;
    gap: var(--st-spacing);

    &__viewer {
        &__title {
            margin-top: 0;
        }

        &__buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: calc(var(--st-spacing)/2);
        }
    }

    &__controls {
        .card__content {
            display: flex;
            flex-direction: column;
            gap: var(--st-spacing);
        }

        &__verses {
            margin-top: var(--st-spacing);
        }

        &__buttons {
            display: flex;
            gap: calc(var(--st-spacing)/2);
        }

        &__title {
            margin: 0;
        }
    }

    &__verses {
        .card__content {
            width: 100%;
        }

        &__select {
            width: 100%;
            display: flex;

            label {
                flex-grow: 1;
            }
        }

        &__title {
            margin: 0 0 calc(var(--st-spacing)/2) 0;
        }

        &__input {
            border-radius: var(--st-border-radius);
            overflow: hidden;
            font-size: 1.1em;

            display: flex;
            flex-direction: column;
            //align-items: center;
            gap: var(--st-spacing);

            &__check {
                display: none;

                &:checked + span {
                    color: white;
                    background: var(--st-color-primary);
                }
            }

            &__label {
                padding: var(--half-spacing);
                background: var(--st-color-background);
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
