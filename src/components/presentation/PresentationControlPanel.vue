<template>
    <div class="flex flex-col gap-4" v-if="song && lyrics">
        <base-card class="ring-1 ring-primary">
            <template #header>
                <div class="flex gap-4 items-center justify-between">
                    <h3 class="font-bold">
                        {{ $t("song.viewer") }}
                    </h3>
                    <span class="tracking-wider text-xs py-1 px-2 rounded text-green-600 bg-green-500/20">BETA</span>
                </div>
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
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Lyrics, Song } from "@/classes";
import { PresentationControl } from "@/classes/presentation/control";
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
        control: {
            type: Object,
        },
    },
    name: "presentation-controlpanel",
})
export default class PresentationControlPanel extends Vue {
    public control?: PresentationControl;
    public selectVerses: {
        [key: string]: boolean;
    } = {};
    public currentVerseNumber = 0;
    public currentLinesNumber = 0;
    public lyrics?: Lyrics;
    public languageKey?: string;
    public song?: Song;

    public lineSize = 2;

    public get Control() {
        return this.control ?? new PresentationControl();
    }

    public mounted() {
        this.Control.init();
    }

    public open() {
        this.refresh();
        window.open("/presentation", "SongTreasures - Presentation View", "resizeable,scrollbars");
    }

    public refresh() {
        if (this.lyrics) {
            this.Control.setLyrics(this.lyrics);
            this.Control.preview();
        }
    }

    public next() {
        this.Control.next();
    }

    public previous() {
        this.Control.previous();
    }
}
</script>
