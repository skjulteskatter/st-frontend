<template>
    <base-card v-if="song" class="overflow-visible">
        <template #header>
            <div class="w-full flex items-center gap-2">
                <h3 class="font-bold">{{ $t("song_lyrics") }}</h3>
                <base-button
                    v-if="editor"
                    theme="tertiary"
                    @click="edit()"
                >
                    <template #icon>
                        <PencilAltIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_edit') }}
                </base-button>
                <song-changer class="ml-auto" :label="$t('song_changeSong')" @next="song?.next()" @previous="song?.previous()" :hasNext="song.hasNext" :hasPrevious="song.hasPrevious"/>
                <print-button class="hidden md:flex" />
            </div>
        </template>
        <div class="flex gap-2 items-center mb-4">
            <label class="flex flex-col gap-1">
                <span class="text-xs uppercase tracking-wider opacity-50">{{ $t('common_language') }}</span>
                <select
                    class="rounded-md border-gray-300 dark:bg-secondary dark:border-gray-500"
                    id="language"
                    name="language"
                    v-model="SelectedLanguage"
                    @change="translateTo()"
                >
                    <option
                        v-for="l in (chordsEnabled ? newMelodyView ? newMelodyLanguages : transposeLanguages : languages)"
                        :value="l.key"
                        :key="l.key"
                    >
                        {{ l.name }}
                    </option>
                </select>
            </label>
            <label class="flex flex-col gap-1">
                <span class="text-xs uppercase tracking-wider opacity-50">{{ $t('song_lyricsType') }}</span>
                <select
                    class="rounded-md border-gray-300 dark:bg-secondary dark:border-gray-500"
                    id="format"
                    name="format"
                    v-model="SelectedFormat"
                    @change="format()"
                >
                    <option
                        v-for="f in [ 'default', 'chords', 'performance']"
                        :value="f"
                        :key="f"
                    >
                        {{ $t('view_' + f) }}
                    </option>
                </select>
            </label>
            <div class="flex flex-col gap-1" v-show="chordsEnabled">
                <span class="text-xs uppercase tracking-wider opacity-50">{{ $t('song_key') }}</span>
                <base-dropdown
                    origin="left"
                    :label="
                        relativeTranspositions.find(
                            (r) => r.value == selectedTransposition
                        )?.view ?? 'Transpose'
                    "
                >
                    <div class="overflow-y-auto max-h-64 shadow-scroll">
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
            </div>
            <SwitchGroup as="div" class="flex flex-col cursor-pointer ml-4" v-if="chordsEnabled && song.newMelody && song.newMelodies.includes(languageKey)">
                <SwitchLabel class="text-sm text-gray-500 dark:text-gray-400">{{ $t("song_newMelody") }}</SwitchLabel>
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
        </div>
        <loader :loading="!lyrics || loading" position="local">
            <component
                :is="lyrics?.ContainsChords ? (type === 'chords' ? 'TransposedLyricsViewer' : 'PerformanceViewer') :
                'LyricsViewer'"
                :lyrics="lyrics"
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
    PerformanceViewer,
} from "./lyrics";
import { useStore } from "@/store";
import { SongsMutationTypes } from "@/store/modules/songs/mutation-types";
import { transposer } from "@/classes/transposer";
import { appSession } from "@/services/session";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import { SongChanger } from "@/components/songs";
import { PencilAltIcon } from "@heroicons/vue/solid";
import { SongViewType } from "@/store/modules/songs/state";

@Options({
    components: {
        TransposedLyricsViewer,
        TransposeDropdown,
        PerformanceViewer,
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
        loading: {
            type: Boolean,
        },
        type: {
            type: String,
        },
    },
    name: "lyrics-card",
    emits: [
        "translate",
        "transpose",
        "setView",
    ],
})
export default class LyricsCard extends Vue {
    private store = useStore();
    public song?: Song;
    public lyrics?: Lyrics;
    public collection?: Collection;
    public type?: SongViewType;
    private selectedLanguage = "";

    private selectedFormat: SongViewType = "default";

    public get SelectedFormat() {
        return this.store.state.songs.view;
    }
    public set SelectedFormat(v) {
        this.selectedFormat = v;
    }

    public loaded = false;

    public loading?: boolean;

    public get SelectedLanguage() {
        return this.lyrics?.languageKey ?? "";
    }

    public set SelectedLanguage(v) {
        this.selectedLanguage = v;
    }

    public get chordsEnabled() {
        return this.lyrics?.ContainsChords === true;
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

    public get selectedTransposition() {
        return this.store.state.songs.transposition ?? 0;
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

    public format() {
        this.setView(this.selectedFormat);
    }

    public translateTo() {
        this.$emit("translate", this.selectedLanguage);
    }

    public transpose(n?: number) {
        if (n !== undefined) {
            n += (n > 0 ? 0 : 12);
            while(n > 0 && !Object.values(this.relativeTranspositions).some(i => i.value == n)) {
                n -= 12;
            }
        }
        this.$emit("transpose", n);
    }

    public setView(type: SongViewType) {
        this.$emit("setView", type);
    }

    public newMelody() {
        this.newMelodyView = !this.newMelodyView;
        this.transpose();
    }

    public get OriginalKey() {
        return this.lyrics?.originalKey ?? this.song?.originalKey ?? "C";
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

<style lang="scss">
@import "../style/mixins";

.shadow-scroll {
    @include scrollShadow(white);
}

.dark {
    .shadow-scroll {
        @include scrollShadow(#213F47);
    }
}
</style>
