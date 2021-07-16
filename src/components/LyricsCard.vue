<template>
    <base-card v-if="song" class="overflow-visible" header>
        <template #header>
            <h4 class="font-bold">{{ $t("song.lyrics") }}</h4>
            <div class="flex gap-2 items-end flex-wrap">
                <select
                    class="rounded border-gray-300 dark:bg-secondary dark:border-gray-500"
                    id="language"
                    name="language"
                    v-model="selectedLanguage"
                    @change="translateTo()"
                >
                    <option
                        v-for="l in (type == 'transpose' ? newMelodyView ? newMelodyLanguages : transposeLanguages : languages)"
                        :value="l.key"
                        :key="l.key"
                    >
                        {{ l.name }}
                    </option>
                </select>
                <SwitchGroup as="div" class="flex flex-col cursor-pointer" v-if="song.hasChords">
                    <SwitchLabel class="text-sm text-gray-500 dark:text-gray-400">{{ $t("song.chords") }}</SwitchLabel>
                    <Switch
                        @click="transposeToggle()"
                        v-model="chordsEnabled"
                        class="focus:outline-none"
                    >
                        <div
                            class="relative inline-flex items-center h-8 rounded-full w-16 transition-colors my-1"
                            :class="chordsEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-black dark:bg-opacity-40'"
                        >
                            <span
                                :class="chordsEnabled ? 'translate-x-9' : 'translate-x-1'"
                                class="shadow-md inline-block w-6 h-6 transform bg-white rounded-full transition-transform dark:bg-secondary"
                            />
                        </div>
                    </Switch>
                </SwitchGroup>
                <base-dropdown
                    origin="left"
                    :label="
                        relativeTranspositions.find(
                            (r) => r.value == selectedTransposition
                        )?.view ?? 'Transpose'
                    "
                    :class="{ 'hidden': !chordsEnabled }"
                >
                    <div class="overflow-y-auto max-h-64">
                        <button
                            :class="{
                                'bg-gray-200 dark:bg-gray-800': lyrics?.originalKey == t.original && selectedTransposition != t.value,
                                'bg-primary text-white': selectedTransposition == t.value,
                            }"
                            class="py-1 px-2 w-full rounded flex justify-between gap-4"
                            v-for="t in relativeTranspositions"
                            :key="t.key"
                            :disabled="selectedTransposition == t.value"
                            @click="transpose(t.value)"
                        >
                            <span class="font-semibold">
                                {{ t.key }}
                            </span>
                            <span class="opacity-50">
                                ({{ t.original }})
                            </span>
                        </button>
                    </div>
                </base-dropdown>
                <SwitchGroup as="div" class="flex flex-col cursor-pointer ml-4" v-if="type == 'transpose' && song.newMelody && song.newMelodies.includes(languageKey)">
                    <SwitchLabel class="text-sm text-gray-500 dark:text-gray-400">{{ $t("song.newMelody") }}</SwitchLabel>
                    <Switch
                        @click="newMelody()"
                        class="focus:outline-none"
                    >
                        <div
                            class="relative inline-flex items-center h-8 rounded-full w-16 transition-colors my-1"
                            :class="newMelodyView ? 'bg-primary' : 'bg-gray-300 dark:bg-black dark:bg-opacity-40'"
                        >
                            <span
                                :class="newMelodyView ? 'translate-x-9' : 'translate-x-1'"
                                class="shadow-md inline-block w-6 h-6 transform bg-white rounded-full transition-transform dark:bg-secondary"
                            />
                        </div>
                    </Switch>
                </SwitchGroup>
                <!-- <transpose-dropdown
                    :transpositions="song.transpositions"
                    :transpose="transpose"
                ></transpose-dropdown> -->
                <!-- <base-button v-if="sheetMusicUrl" @click="sheetMusic">Sheet music</base-button> -->
                <song-changer class="ml-auto" :label="$t('song.changeSong')" @next="song?.next()" @previous="song?.previous()" />
                <base-button
                    v-if="editor"
                    theme="tertiary"
                    icon="pencil"
                    @click="edit()"
                >Edit</base-button>
            </div>
        </template>
        <loader :loading="collection?.loadingLyrics || !lyrics" position="local">
            <transposed-lyrics-viewer
                v-if="type == 'transpose' && lyrics?.format == 'html'"
                :lyrics="lyrics"
            >
            </transposed-lyrics-viewer>
            <lyrics-viewer :song="song" v-if="type == 'default' && lyrics?.format == 'json'">
            </lyrics-viewer>

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
} from "./lyrics";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { transposer } from "@/classes/transposer";
import { appSession } from "@/services/session";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { SongChanger } from "@/components/songs";
// import { SheetMusicOptions } from "@/store/songs";
// import { osmd } from "@/services/osmd";

@Options({
    components: {
        TransposedLyricsViewer,
        TransposeDropdown,
        LyricsViewer,
        Switch,
        SwitchGroup,
        SwitchLabel,
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
    public song?: Song;
    public lyrics?: Lyrics;
    public collection?: Collection;
    public selectedLanguage = "";
    public loaded = false;
    public chordsEnabled = false;

    public get relativeTranspositions(): {
        value: number;
        view: string;
        key: string;
        original: string;
    }[] {
        const ts = this.lyrics || this.song ? transposer.getRelativeTranspositions(
            this.lyrics?.secondaryChords ? this.lyrics?.originalKey : this.song?.originalKey ?? "C",
            this.defaultTransposition,
            this.lyrics?.secondaryChords ? this.lyrics?.transpositions : this.song?.transpositions ?? {},
        ) : [];
        return ts;
    }

    public get Lyrics() {
        return this.lyrics;
    }

    public async mounted() {
        const t = transposer.getRelativeTransposition(this.store.getters.user?.settings?.defaultTransposition ?? "C");

        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, t);

        if (this.type == "transpose") {
            this.newMelodyView = false;
            if (this.song?.hasLyrics && this.song?.hasChords) {
                this.chordsEnabled = true;
                this.transposeView();
            } else {
                this.store.commit(SongsMutationTypes.SET_VIEW, "default");
            }
        }

        const fallbackLanguage = this.languages.find(l => l.key == "en")?.key ?? this.languages[0]?.key;


        if (this.song) {
            this.selectedLanguage = (Object.keys(this.song.name).includes(this.languageKey)
                    ? this.languageKey
                    : fallbackLanguage) 
                ?? this.languageKey;
        }
    }

    public get selectedTransposition() {
        return this.store.state.songs.transposition ?? 0;
    }

    public set selectedTransposition(v) {
        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, v);
    }

    public get newMelodyView() {
        return this.store.state.songs.newMelody;
    }

    public set newMelodyView(v) {
        this.store.commit(SongsMutationTypes.SET_NEW_MELODY, v);
    }

    // public get selectedTransposition() {
    //     const t = this.store.state.songs.transposition ?? 0;

    //     return Object.values(this.transpositions).includes(t) ? t : t + 12;
    // }

    // public set selectedTransposition(v) {
    //     this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, v);
    // }

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
            if (this.type === "transpose") {
                await this.transpose();
            }
        }
    }

    public async transpose(n?: number) {
        if (n !== undefined) {
            n += (n > 0 ? 0 : 12);
            while(n > 0 && !Object.values(this.relativeTranspositions).some(i => i.value == n)) {
                n -= 12;
            }
            this.selectedTransposition = n;
        }

        if (this.song) {
            await this.collection?.transposeLyrics(
                this.song.number,
                this.selectedTransposition,
                this.store.state.songs.language,
                undefined,
                this.newMelodyView
            );
        }
    }

    public transposeToggle() {
        if (this.type === "transpose") {
            this.store.commit(SongsMutationTypes.SET_VIEW, "default");
        } else {
            this.transposeView();
        }
    }

    public async transposeView() {
        this.store.commit(SongsMutationTypes.SET_VIEW, "loading");
        this.store.commit(SessionMutationTypes.EXTEND, false);
        await this.transpose(transposer.getRelativeTransposition(this.defaultTransposition));
        this.store.commit(SongsMutationTypes.SET_VIEW, "transpose");
    }

    public async newMelody() {
        this.newMelodyView = !this.newMelodyView;
        await this.transpose();
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

    // public transpositionString(key: string, value: number): (string | number)[] {
    //     if (this.defaultTransposition !== "C") {
    //         const transposed = transposer.getTransposedString(key, 12 - transposer.getRelativeTransposition(this.defaultTransposition));

    //         return [key, value, transposed ?? "C"];
    //     }
    //     else {
    //         return [key, value];
    //     }
    // }

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
