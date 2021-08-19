<template>
    <base-card v-if="song" class="overflow-visible">
        <template #header>
            <div class="w-full flex items-center gap-2">
                <h3 class="font-bold">{{ $t("song.lyrics") }}</h3>
                <song-changer class="ml-auto" :label="$t('song.changeSong')" @next="song?.next()" @previous="song?.previous()" :hasNext="song.hasNext" :hasPrevious="song.hasPrevious"/>
                <print-button class="hidden md:flex" />
            </div>
            <div class="flex gap-2 items-end flex-wrap">
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
            </div>
        </template>
        <loader :loading="collection?.loadingLyrics || !lyrics" position="local">
            <base-button @click="toggleAll">Unset</base-button>
            <div
                class="w-full whitespace-pre-line mb-4"
                :class="{
                    'text-lg': currentVerses.includes((i + 1).toString()),
                }"
                :style="availableVerses.includes((i + 1).toString()) ? '' : 'color: red'"
                v-for="(verse, i) in text"
                :key="lyrics?.languageKey + verse.name + verse.content[0] + i"
            >
                <b class="text-sm">{{ verse.name }}</b>
                <p class="leading-7 w-max cursor-pointer" @click="toggleVerse((i + 1).toString())">{{ verse.content.join("\n") }}</p>
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
import { control } from "@/classes/presentation/control";

@Options({
    components: {
        TransposedLyricsViewer,
        TransposeDropdown,
        LyricsViewer,
        PrintButton,
        SongChanger,
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
    },
    name: "lyrics-card",
})
export default class LyricsCard extends Vue {
    private store = useStore();
    private control = control;
    public song?: Song;
    public lyrics?: Lyrics;
    public collection?: Collection;
    public selectedLanguage = "";
    public loaded = false;

    public availableVerses = this.control.AvailableVerses;
    public currentVerses = this.control.currentVerses;

    public toggleVerse(index: string) {
        this.control.toggleVerse(index);
        if (this.availableVerses.includes(index)) {
            this.availableVerses = this.availableVerses.filter(i => i != index);
        } else {
            this.availableVerses.push(index);
        }
    }

    public toggleAll() {
        for (const v of this.availableVerses) {
            this.control.toggleVerse(v);
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

        this.control.registerCallback("control", () => {
            this.currentVerses = this.control.currentVerses;
        });
        this.control.registerCallback("settings", () => {
            this.availableVerses = this.control.AvailableVerses;
        });
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
