<template>
    <base-card v-if="song" class="overflow-visible">
        <template #header>
            <h3 class="font-bold mb-2">{{ $t("song.lyrics") }}</h3>
            <div class="flex justify-between gap-2">
                <select
                    class="rounded-md border-gray-300 dark:bg-secondary dark:border-gray-500"
                    id="language"
                    name="language"
                    v-model="selectedLanguage"
                    @change="translateTo()"
                >
                    <option
                        v-for="l in languages"
                        :value="l.key"
                        :key="l.key"
                    >
                        {{ l.name }}
                    </option>
                </select>
                <base-button @click="toggleAll">{{ $t(!unset ? 'unset' : 'set') }}</base-button>
            </div>
        </template>
        <loader :loading="collection?.loadingLyrics || !lyrics" position="local">
            <div
                class="w-full cursor-pointer whitespace-pre-line mb-2 hover:bg-black/5 dark:hover:bg-white/10 p-2"
                v-for="(verse, i) in text"
                :key="lyrics?.languageKey + verse.name + verse.content[0] + i"
                :class="{
                    'border-l-2 border-primary bg-primary/10': currentVerses.includes((i + 1).toString()),
                    'bg-red-500/10': !availableVerses.includes((i + 1).toString()),
                }"
                @click="toggleVerse((i + 1).toString())"
            >
                <b class="text-sm mb-1 flex items-center gap-2">
                    <CheckCircleIcon v-if="availableVerses.includes((i + 1).toString())" class="w-5 h-5 text-green-500" />
                    <MinusCircleIcon v-else class="w-5 h-5 text-red-500" />
                    {{ verse.name }}
                </b>
                <p
                    class="leading-7"
                    :class="{ 'opacity-50 italic': !availableVerses.includes((i + 1).toString()) }"
                >{{ verse.content.join("\n") }}</p>
            </div>
            <div v-if="lyrics?.notes">{{lyrics.notes}}</div>
        </loader>
    </base-card>
</template>
<script lang="ts">
import { Collection, Lyrics, Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import {
    TransposedLyricsViewer,
    LyricsViewer,
    TransposeDropdown,
    PrintButton,
} from "../lyrics";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { transposer } from "@/classes/transposer";
import { appSession } from "@/services/session";
import { SongChanger } from "@/components/songs";
import { PresentationControl } from "@/classes/presentation/control";
import { CheckCircleIcon } from "@heroicons/vue/solid";
import { MinusCircleIcon } from "@heroicons/vue/outline";

@Options({
    components: {
        TransposedLyricsViewer,
        TransposeDropdown,
        LyricsViewer,
        PrintButton,
        SongChanger,
        CheckCircleIcon,
        MinusCircleIcon,
    },
    props: {
        lyrics: {
            type: Object,
        },
        song: {
            type: Object,
        },
        collection: {
            type: Object,
        },
        control: {
            type: Object,
        },
    },
    name: "lyrics-card",
})
export default class LyricsCard extends Vue {
    private store = useStore();
    public control?: PresentationControl;
    public get Control() {
        return this.control ?? new PresentationControl();
    }

    public song?: Song;
    public lyrics?: Lyrics;
    public collection?: Collection;
    public selectedLanguage = "";
    public loaded = false;
    public unset = false;

    public availableVerses: string[] = [];
    public currentVerses = this.Control.currentVerses;

    public toggleVerse(index: string) {
        this.Control.toggleVerse(index);
        this.availableVerses = this.Control.AvailableVerses;
    }

    public toggleAll() {
        if (this.lyrics) {
            if (this.unset) {
                this.Control.resetSettings(this.lyrics);
                this.unset = false;
                this.availableVerses = this.Control.AvailableVerses;
            } else {
                for (const i of this.availableVerses) {
                    this.toggleVerse(i);
                    this.unset = true;
                }
            }
        }
    }

    public get Lyrics() {
        return this.lyrics;
    }

    public async mounted() {

        const t = transposer.getRelativeTransposition(this.store.getters.user?.settings?.defaultTransposition ?? "C");

        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, t);

        const fallbackLanguage = this.languages.find(l => l.key == "en")?.key ?? this.languages[0]?.key;


        if (this.song) {
            this.selectedLanguage = (Object.keys(this.song.name).includes(this.languageKey)
                    ? this.languageKey
                    : fallbackLanguage) 
                ?? this.languageKey;
        }

        this.Control.registerCallback("control", () => {
            this.currentVerses = this.Control.currentVerses;
        });
        this.Control.registerCallback("settings", () => {
            this.availableVerses = this.Control.AvailableVerses;
        });
        this.Control.registerCallback("lyrics", () => {
            this.availableVerses = this.Control.AvailableVerses;
        });
        this.Control.registerCallback("preview", () => {
            this.currentVerses = this.Control.currentVerses;
        });

        this.availableVerses = this.Control.AvailableVerses;
    }

    public get text() {
        return this.lyrics?.getText({
            chorus: this.$t("song.chorus"),
            bridge: this.$t("song.bridge"),
        }, true) ?? [];
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get languages() {
        const languages = appSession.languages;

        return languages.filter((l) => this.song?.name[l.key]);
    }

    public async translateTo() {
        if (this.song) {
            await this.collection?.getLyrics(
                this.song,
                this.selectedLanguage
            );
            this.store.commit(
                SongsMutationTypes.LANGUAGE,
                this.selectedLanguage,
            );
        }
    }

    public get OriginalKey() {
        return this.lyrics?.originalKey ?? this.song?.originalKey ?? "C";
    }

    public get type() {
        return this.store.state.songs.view;
    }

    public get defaultTransposition() {
        return this.store.getters.user?.settings?.defaultTransposition ?? "C";
    }

    public get transposeLanguages() {
        return this.languages.filter(l => this.collection?.hasChords[l.key]);
    }

    public get newMelodyLanguages() {
        return this.transposeLanguages.filter(l => this.song?.newMelodies.includes(l.key));
    }

    public transpositionStrings() {
        return transposer.getRelativeTranspositions(
            this.song?.originalKey ?? "C",
            this.defaultTransposition,
            this.song?.transpositions ?? {},
        );
    }

    public edit() {
        window.open(`https://songtreasures.sanity.studio/desk/lyrics;${this.lyrics?.id}`);
    }

    public get editor() {
        return this.store.getters.user?.roles.some(r => ["administrator", "editor"].includes(r)) == true;
    }
}
</script>
