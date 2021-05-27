<template>
    <base-card v-if="song" class="overflow-visible" header toggleable>
        <template #header>
            <h4 class="font-bold">{{ $t("song.lyrics") }}</h4>
            <div class="flex gap-2">
                <base-dropdown
                    origin="left"
                    :style="type == 'transpose' ? '' : 'display: none;'"
                    :label="
                        relativeTranspositions.find(
                            (r) => r.value == selectedTransposition
                        )?.view
                    "
                    class="lyrics-card__header__transpose"
                >
                    <button
                        :class="[
                            selectedTransposition == t.value
                                ? 'lyrics-card__header__transpose-button lyrics-card__header__transpose-button--active'
                                : 'lyrics-card__header__transpose-button',
                        ]"
                        v-for="t in relativeTranspositions"
                        :key="t.key"
                        :disabled="selectedTransposition == t.value"
                        @click="transpose(t.value)"
                    >
                        {{ t.view }}
                    </button>
                </base-dropdown>
                <!-- <transpose-dropdown
                    :transpositions="song.transpositions"
                    :transpose="transpose"
                ></transpose-dropdown> -->
                <base-button
                    v-if="song.hasChords"
                    :style="{display: Lyrics?.hasChords ? '' : 'none'}"
                    @click="transposeToggle()"
                    icon="music"
                    theme="tertiary"
                >
                    {{ $t("song.chords") }}
                </base-button>
                <select
                    id="language"
                    name="language"
                    v-model="selectedLanguage"
                    @change="translateTo()"
                    class="p-2 border border-gray-300 rounded"
                >
                    <option
                        v-for="l in (type == 'transpose' ? transposeLanguages : languages)"
                        :value="l.key"
                        :key="l.key"
                    >
                        {{ l.name }}
                    </option>
                </select>
                <!-- <base-button v-if="sheetMusicUrl" @click="sheetMusic">Sheet music</base-button> -->
            </div>
        </template>
        <loader :loading="collection?.loadingLyrics" position="local">
            <transposed-lyrics-viewer
                v-if="type == 'transpose' && lyrics?.format == 'html'"
                :lyrics="lyrics"
            >
            </transposed-lyrics-viewer>
            <lyrics-viewer v-if="type == 'default' && lyrics?.format == 'json'">
            </lyrics-viewer>
        </loader>
    </base-card>
</template>
<script lang="ts">
import { Collection, Lyrics, Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { BaseCard } from "@/components";
import { BaseDropdown } from "@/components/inputs";
import {
    TransposedLyricsViewer,
    LyricsViewer,
    TransposeDropdown,
} from "./lyrics";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { transposer } from "@/classes/transposer";
// import { SheetMusicOptions } from "@/store/songs";
// import { osmd } from "@/services/osmd";

@Options({
    components: {
        TransposedLyricsViewer,
        TransposeDropdown,
        LyricsViewer,
        BaseCard,
        BaseDropdown,
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
    public store = useStore();
    public song?: Song;
    public lyrics?: Lyrics;
    public collection?: Collection;
    public selectedLanguage = "";
    public loaded = false;

    public relativeTranspositions: {
        value: number;
        view: string;
        key: string;
        original: string;
    }[] = [];

    public get Lyrics() {
        return this.lyrics;
    }

    public mounted() {
        const t = transposer.getRelativeTransposition(this.store.getters.user?.settings?.defaultTransposition ?? "C");

        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, t);

        if (this.type == "transpose") {
            if (this.song?.hasLyrics && this.song?.hasChords) {
                this.transposeView();
            } else {
                this.store.commit(SongsMutationTypes.SET_VIEW, "default");
            }
        }

        const fallbackLanguage = this.languages.find(l => l.key == "en")?.key ?? this.languages[0]?.key;

        this.selectedLanguage =
            (this.languages.find((l) => l.key == this.languageKey)
                ? this.languageKey
                : fallbackLanguage) ?? this.languageKey;

        if (this.song) {
            try {
                this.relativeTranspositions = transposer.getRelativeTranspositions(
                    this.song.originalKey,
                    this.defaultTransposition,
                    this.song.transpositions,
                );
            } catch {
                // ss
            }
        }
    }

    public get selectedTransposition() {
        const t = this.store.state.songs.transposition ?? 0;

        if (!this.song) return 0;
        const ts: number[] = [];
        for (const k of Object.keys(this.song.transpositions)) {
            ts.push(this.song.transpositions[k]);
        }

        if (ts.includes(t)) {
            return t;
        } else {
            return t + 12;
        }
    }

    public set selectedTransposition(v) {
        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, v);
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
        const languages = this.store.state.session.languages;

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
            this.selectedTransposition = n;
        }

        if (this.song) {
            const lyrics = await this.collection?.transposeLyrics(
                this.song.number,
                this.selectedTransposition,
                this.store.state.songs.language
            );
            if (lyrics?.transposition !== undefined)
                this.store.commit(
                    SongsMutationTypes.SET_TRANSPOSITION,
                    lyrics?.transposition,
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
        await this.transpose();
        this.store.commit(SongsMutationTypes.SET_VIEW, "transpose");
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

    public transpositionStrings() {
        return transposer.getRelativeTranspositions(
            this.song?.originalKey ?? "C",
            this.defaultTransposition,
            this.song?.transpositions ?? {},
        );
    }
}
</script>
