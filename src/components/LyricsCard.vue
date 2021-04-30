<template>
    <base-card v-if="song" class="lyrics-card" header toggleable>
        <template #header>
            <h4 class="lyrics-card__title">{{ $t("song.lyrics") }}</h4>
            <div class="lyrics-card__header">
                <div class="lyrics-card__header__settings">
                    <select
                        v-if="type == 'transpose'"
                        id="transposition"
                        name="transposition"
                        v-model="selectedTransposition"
                        @change="transpose"
                    >
                        <option
                            v-for="t in transpositionStrings()"
                            :value="transpositions[t[0]]"
                            :key="t"
                        >
                            {{ t[0] }}
                            <span v-if="t[1]">({{t[1]}})</span>
                        </option>
                    </select>
                    <base-button
                        v-if="song.hasChords"
                        @click="transposeToggle"
                        icon="music"
                        theme="tertiary"
                    >
                        {{ $t("song.chords") }}
                    </base-button>
                    <select
                        id="language"
                        name="language"
                        v-model="selectedLanguage"
                        @change="translateTo"
                    >
                        <option
                            v-for="l in languages"
                            :value="l.key"
                            :key="l.key"
                        >
                            {{ l.name }}
                        </option>
                    </select>
                    <!-- <base-button v-if="sheetMusicUrl" @click="sheetMusic">Sheet music</base-button> -->
                </div>
            </div>
        </template>
        <div v-if="lyrics">
            <transposed-lyrics-viewer
                v-if="lyrics.format == 'html'"
            >
            </transposed-lyrics-viewer>
            <lyrics-viewer v-if="lyrics.format == 'json'"
            >
            </lyrics-viewer>
        </div>
    </base-card>
</template>
<script lang="ts">
import { Collection, Lyrics, Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { TransposedLyricsViewer, LyricsViewer } from "./lyrics";
import { BaseCard, BaseButton } from "./";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { transposer } from "@/classes/transposer";
// import { SheetMusicOptions } from "@/store/songs";
// import { osmd } from "@/services/osmd";

@Options({
    components: {
        TransposedLyricsViewer,
        LyricsViewer,
        BaseCard,
        BaseButton,
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
    //public selectedTransposition = 0;
    public loaded = false;

    public mounted() {
        if (this.type == "transpose") {
            if (this.song?.hasLyrics && this.song?.hasChords) {
                this.transposeView();
            } else {
                this.store.commit(SongsMutationTypes.SET_VIEW, "default");
            }
        }

        this.selectedLanguage =
            (this.languages.find((l) => l.key == this.languageKey)
                ? this.languageKey
                : this.languages[0]?.key) ?? this.languageKey;
        
        // if (this.sheetMusicUrl) {
        //     const o: SheetMusicOptions = {
        //         show: true,
        //         url: 'https://dmb-cdn.azureedge.net/files/' + this.sheetMusicUrl,
        //         originalKey: this.song?.originalKey,
        //         transposition: this.songStore.state.smTransposition,
        //     }

        //     this.songStore.commit("sheetMusic", o);
        // }
    }

    // public sheetMusic() {
    //     this.$router.push({name: "songs-sheet-music"});
    //     osmd.load(this.songStore.state.sheetMusic);
    // }

    // public get sheetMusicUrl() {
    //     return this.song?.sheetMusic?.find((s) => s.category === "leadsheet")
    //         ?.id;
    // }

    public get selectedTransposition() {
        const t = this.store.state.songs.transposition ?? 0;

        const ts: number[] = [];
        for (const e of Object.keys(this.transpositions)) {
            if (!ts.includes(this.transpositions[e])) {
                ts.push(this.transpositions[e]);
            }
        }

        return ts.includes(t) ? t : t + 12;
    }

    public set selectedTransposition(v) {
        this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, v);
    }

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
                this.song.number,
                this.selectedLanguage
            );
            this.store.commit(SongsMutationTypes.LANGUAGE, this.selectedLanguage);
            if (this.type === "transpose") {
                await this.transpose();
            }
        }
    }

    public async transpose() {
        if (this.song) {
            const lyrics = await this.collection?.transposeLyrics(
                this.song.number,
                this.selectedTransposition,
                this.store.state.songs.language,
            );
            if (lyrics?.transposition !== undefined)
                this.store.commit(SongsMutationTypes.SET_TRANSPOSITION, lyrics?.transposition);
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
        this.store.commit(SessionMutationTypes.EXTEND, false);
        await this.transpose();
        this.store.commit(SongsMutationTypes.SET_VIEW, "transpose");
    }

    public get transpositions() {
        return this.song?.transpositions ?? {};
    }

    public get type() {
        return this.store.state.songs.view;
    }

    public get defaultTransposition() {
        return this.store.getters.user?.settings?.defaultTransposition ?? "C";
    }

    public transpositionString(key: string): string[] {
        if (this.defaultTransposition !== "C") {
            const transposed = transposer.getTransposedString(key, 12 - transposer.getRelativeTransposition(this.defaultTransposition));

            return [key, transposed ?? "C"];
        }
        else {
            return [key];
        }
    }

    public transpositionStrings() {
        const strings = Object.keys(this.transpositions).map(t => this.transpositionString(t));
        return strings;
    }
}
</script>
<style lang="scss">
.lyrics-card {
    &__title {
        margin: 0 0 0.5em 0;
    }

    &__header {
        width: 100%;
        display: flex;
        gap: calc(var(--st-spacing) / 2);

        &__label {
            display: block;
            opacity: 0.5;
            margin-bottom: 0.2em;
        }

        &__settings {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            gap: calc(var(--st-spacing) / 2);
        }
    }
}
</style>
