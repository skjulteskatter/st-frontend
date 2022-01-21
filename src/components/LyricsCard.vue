<template>
    <BaseCard class="overflow-visible">
        <template #header>
            <div class="w-full flex items-center gap-2">
                <h3 class="font-bold">{{ $t("song_lyrics") }}</h3>
                <BaseButton
                    v-if="editor"
                    theme="tertiary"
                    @click="edit()"
                >
                    <template #icon>
                        <PencilAltIcon class="w-4 h-4" />
                    </template>
                    {{ $t('common_edit') }}
                </BaseButton>
                <SongChanger class="ml-auto" :label="$t('song_changeSong')" @next="song?.next()" @previous="song?.previous()" :hasNext="song.hasNext" :hasPrevious="song.hasPrevious"/>
                <PrintButton class="hidden md:flex" />
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
            <label class="flex flex-col gap-1" v-if="song.hasChords">
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
                <BaseDropdown
                    origin="left"
                    :label="
                        relativeTranspositions.find(
                            (r) => r.value == selectedTransposition
                        )?.view ?? $t('song_transpose')
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
                </BaseDropdown>
            </div>
            <SwitchGroup as="div" class="flex flex-col cursor-pointer ml-4" v-if="chordsEnabled && song.newMelody && song.newMelodies.includes(languageKey)">
                <SwitchLabel class="text-sm text-gray-500 dark:text-gray-400">{{ $t("song_newMelody") }}</SwitchLabel>
                <Switch
                    @click="newMelody()"
                    class="focus-visible:outline-none"
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
        <Loader :loading="!lyrics || loading" position="local">
            <component
                :is="lyrics?.ContainsChords ? (type === 'chords' ? 'TransposedLyricsViewer' : 'PerformanceViewer') :
                'LyricsViewer'"
                :lyrics="lyrics"
            />
            <div v-if="lyrics?.notes">{{lyrics.notes}}</div>
        </Loader>
    </BaseCard>
</template>
<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Collection, Lyrics, Song } from "@/classes";
import {
    TransposedLyricsViewer,
    LyricsViewer,
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

export default defineComponent({
    name: "lyrics-card",
    components: {
        TransposedLyricsViewer,
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
            type: Object as PropType<Lyrics | null>,
        },
        song: {
            type: Object as PropType<Song>,
            required: true,
        },
        collection: {
            type: Object as PropType<Collection>,
        },
        loading: {
            type: Boolean,
        },
        type: {
            type: String as PropType<SongViewType>,
        },
    },
    data: () => ({
        store: useStore(),
        selectedLanguage: "",
        selectedFormat: "default" as SongViewType,
    }),
    computed: {
        SelectedFormat: {
            get() {
                return this.store.state.songs.view;
            },
            set(v: SongViewType) {
                this.selectedFormat = v;
            },
        },
        SelectedLanguage: {
            get() {
                return this.lyrics?.languageKey ?? "";
            },
            set(v: string) {
                this.selectedLanguage = v;
            },
        },
        chordsEnabled() {
            return this.lyrics?.ContainsChords === true;
        },
        relativeTranspositions(): {
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
        },
        selectedTransposition() {
            return this.store.state.songs.transposition ?? 0;
        },
        newMelodyView: {
            get() {
                return this.store.state.songs.newMelody;
            },
            set(v: boolean) {
                this.store.commit(SongsMutationTypes.SET_NEW_MELODY, v);
            },
        },
        languageKey() {
            return this.store.getters.languageKey;
        },
        languages() {
            const languages = appSession.languages;
            return languages.filter((l) => this.song?.name[l.key]);
        },
        defaultTransposition() {
            return this.store.getters.user?.settings?.defaultTransposition ?? "C";
        },
        transposeLanguages() {
            return this.languages.filter(l => this.collection?.hasChords[l.key]);
        },
        newMelodyLanguages() {
            return this.transposeLanguages.filter(l => this.song?.newMelodies.includes(l.key));
        },
        editor() {
            return this.store.getters.user?.roles.some(r => ["administrator", "editor"].includes(r)) == true;
        },
    },
    emits: [
        "translate",
        "transpose",
        "setView",
    ],
    methods: {
        format() {
            this.setView(this.selectedFormat);
        },
        translateTo() {
            this.$emit("translate", this.selectedLanguage);
        },
        transpose(n?: number) {
            if (n !== undefined) {
                n += (n > 0 ? 0 : 12);
                while(n > 0 && !Object.values(this.relativeTranspositions).some(i => i.value == n)) {
                    n -= 12;
                }
            }
            this.$emit("transpose", n);
        },
        setView(type: SongViewType) {
            this.$emit("setView", type);
        },
        newMelody() {
            this.newMelodyView = !this.newMelodyView;
            this.transpose();
        },
        edit() {
            window.open(`https://songtreasures.sanity.studio/desk/lyrics;${this.lyrics?.id}`);
        },
    },
});
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
