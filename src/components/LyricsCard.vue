<template>
    <base-card v-if="lyrics && song" class="lyrics-card" header toggleable>
        <template #header>
            <h4 class="lyrics-card__title">{{ $t("song.lyrics") }}</h4>
            <div class="lyrics-card__header">
                <div class="lyrics-card__header__settings">
                    <select
                        v-if="transposed"
                        id="transposition"
                        name="transposition"
                        v-model="selectedTransposition"
                        @change="transpose"
                    >
                        <option
                            v-for="t in Object.keys(this.transpositions)"
                            :value="this.transpositions[t]"
                            :key="t"
                        >
                            {{ t }}
                        </option>
                    </select>
                    <base-button
                        v-if="lyrics.hasChords"
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
        <transposed-lyrics-viewer
            v-if="type === 'transpose'"
            :lyrics="transposedLyrics"
            :selectedTransposition="selectedTransposition"
            ref="transposed"
        >
        </transposed-lyrics-viewer>
        <lyrics-viewer v-else :lyrics="lyrics" :song="song"></lyrics-viewer>
    </base-card>
</template>
<script lang="ts">
import { Collection, Lyrics, Song } from "@/classes";
import { Options, Vue } from "vue-class-component";
import { TransposedLyricsViewer, LyricsViewer } from "./lyrics";
import { BaseCard, BaseButton } from "./";
import { useStore } from "@/store/typed";
import { SessionMutationTypes } from "@/store/typed/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/typed/modules/songs/mutation-types";
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
        if (this.transposed) {
            if (this.song?.hasLyrics && this.lyrics?.hasChords) {
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
        for (const k of Object.keys(this.transpositions)) {
            ts.push(this.transpositions[k]);
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
                (this.$refs.transposed as TransposedLyricsViewer).transpose(
                    this.selectedTransposition,
                );
            }
        }
    }

    public async transpose() {
        (this.$refs.transposed as TransposedLyricsViewer).transpose(
            this.selectedTransposition,
        );
    }

    public transposeToggle() {
        if (this.type === "transpose") {
            this.store.commit(SongsMutationTypes.SET_VIEW, "default");
        } else {
            this.transposeView();
        }
    }

    public get actualLyrics() {
        return this.lyrics ?? this.store.getters.lyrics;
    }

    public async transposeView() {
        this.store.commit(SessionMutationTypes.EXTEND, false);
        const lyrics = await this.collection?.transposeLyrics(
            this.song?.number ?? 0,
            this.selectedTransposition,
            this.store.state.songs.language,
            this.store.state.songs.transcode,
        );
        this.store.commit(SongsMutationTypes.SET_LYRICS_TRANSPOSED, lyrics);
        this.store.commit(SongsMutationTypes.SET_VIEW, "transpose");
    }

    public get transposedLyrics() {
        return this.store.state.songs.transposedLyrics;
    }

    public get transpositions() {
        return this.song?.transpositions ?? {};
    }

    public get transposition() {
        return (
            this.transposedLyrics?.transposedToKey ??
            this.lyrics?.originalKey ??
            ""
        );
    }

    public get transposed() {
        return this.type === "transpose";
    }

    public get type() {
        return this.store.state.songs.view;
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
