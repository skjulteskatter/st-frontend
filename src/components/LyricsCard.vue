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
                        v-for="l in (type == 'transpose' ? newMelodyView ? newMelodyLanguages : transposeLanguages : languages)"
                        :value="l.key"
                        :key="l.key"
                    >
                        {{ l.name }}
                    </option>
                </select>
                <SwitchGroup as="div" class="flex flex-col gap-1 cursor-pointer" v-if="song.hasChords">
                    <SwitchLabel class="text-xs tracking-wide">{{ $t("song.chords") }}</SwitchLabel>
                    <Switch
                        @click="transposeToggle()"
                        v-model="chordsEnabled"
                        class="focus:outline-none"
                    >
                        <div
                            class="relative inline-flex items-center h-6 rounded-full w-10 transition-colors"
                            :class="chordsEnabled ? 'bg-primary' : 'bg-black/20 dark:bg-white/40'"
                        >
                            <span
                                :class="chordsEnabled ? 'translate-x-5' : 'translate-x-1'"
                                class="shadow-md inline-block w-4 h-4 transform bg-white rounded-full transition-transform dark:bg-secondary"
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
                <base-button
                    v-if="editor"
                    class="ml-auto"
                    theme="tertiary"
                    @click="edit()"
                >
                    <template #icon>
                        <PencilAltIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common.edit') }}
                </base-button>
            </div>
        </template>
        <loader :loading="collection?.loadingLyrics || !lyrics" position="local">
            <component
                :is="type == 'transpose' && lyrics?.format == 'html' ? 'TransposedLyricsViewer' : 'LyricsViewer'"
                :song="type == 'default' ? song : undefined"
                :lyrics="type == 'transpose' ? lyrics : undefined"
            />
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
} from "./lyrics";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { transposer } from "@/classes/transposer";
import { appSession } from "@/services/session";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { SongChanger } from "@/components/songs";
import { PencilAltIcon } from "@heroicons/vue/solid";

@Options({
    components: {
        TransposedLyricsViewer,
        TransposeDropdown,
        LyricsViewer,
        PrintButton,
        Switch,
        SwitchGroup,
        SwitchLabel,
        SongChanger,
        PencilAltIcon,
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

    public get chordsEnabled() {
        return this.lyrics?.format == "html";
    }

    public set chordsEnabled(v) {
        // 
    }

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
