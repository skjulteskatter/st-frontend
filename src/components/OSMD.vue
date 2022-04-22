<template>
    <BaseCard>
        <template #header>
            <div>
                <div v-if="song && collection && showInfo">
                    <h2 class="text-xl font-bold">{{ song.getName(languageKey) }}</h2>
                    <div class="flex gap-2 items-center opacity-50 tracking-wide">
                        <small v-if="collection.name">{{ collection.getName(languageKey) }}
                            {{ song.getNumber(collection.id) }}</small>
                        <span>&middot;</span>
                        <small v-if="song.verses">{{ song.verses }}
                            {{ $t('song_verses').toLocaleLowerCase() }}</small>
                    </div>
                    <div class="flex flex-col mt-2">
                        <small v-if="song.Authors.length">{{
                                (song.yearWritten
                                    ? $t('song_writtenInBy').replace(
                                        '$year',
                                        song.yearWritten.toString()
                                    )
                                    : $t('song_writtenBy')
                                ).replace('$authors', song.Authors.map(c => c.name).join(', '))
                        }}</small>
                        <small v-if="song.Composers.length">{{
                                (song.yearComposed
                                    ? $t('song_composedInBy').replace(
                                        '$year',
                                        song.yearComposed.toString()
                                    )
                                    : $t('song_composedBy')
                                ).replace(
                                    '$composers',
                                    song.Composers.map(c => c.name).join(', ')
                                )
                        }}</small>
                        <small v-else>{{ $t('song_unknownComposer') }}</small>
                    </div>
                    <div class="text-gray-600" v-if="melodyOrigin">
                        <small>{{ melodyOrigin }}</small>
                    </div>
                </div>
                <button v-if="onSongViewer" class="flex float-right text-red-700" @click="close()">
                    <XIcon class="w-4 h-4" />
                </button>
                <div class="flex">
                    <label class="mr-2">
                        <span class="text-sm text-gray-500">{{ $t('song_key') }}</span>
                        <BaseDropdown origin="left" :label="
                            relativeTranspositions.find(r => r.value == transposition)
                                ?.view ?? $t('song_transpose')
                        " class="">
                            <div class="max-h-64 overflow-y-auto shadow-scroll">
                                <button :class="{
                                    'bg-primary text-white': transposition == t.value,
                                    'bg-gray-200 dark:bg-gray-800':
                                        options?.originalKey == t.original &&
                                        transposition != t.value,
                                }" class="py-1 px-4 rounded w-full flex justify-between gap-4" v-for="t in relativeTranspositions"
                                    :key="t.key" :disabled="transposition == t.value" @click="transpose(t.value)">
                                    <span class="font-semibold">
                                        {{ t.key }}
                                    </span>
                                    <span class="opacity-50" v-if="t.key != t.original">
                                        ({{ t.original }})
                                    </span>
                                </button>
                            </div>
                        </BaseDropdown>
                    </label>
                    <label class="mr-2">
                        <span class="text-sm text-gray-500">{{ $t('song_clef') }}</span>
                        <BaseDropdown origin="left" :label="options?.clef" class="">
                            <div class="max-h-64 overflow-y-auto shadow-scroll">
                                <button :class="{
                                    'bg-primary text-white': options?.clef == 'bass',
                                }" class="py-1 px-4 rounded w-full flex justify-between gap-4" :disabled="options?.clef == 'bass'"
                                    @click="setClef('bass')">
                                    <span class="font-semibold">
                                        Bass
                                    </span>
                                </button>
                                <button :class="{
                                    'bg-primary text-white': options?.clef == 'treble',
                                }" class="py-1 px-4 rounded w-full flex justify-between gap-4" :disabled="options?.clef == 'treble'"
                                    @click="setClef('treble')">
                                    <span class="font-semibold">
                                        Treble
                                    </span>
                                </button>
                                <button :class="{
                                    'bg-primary text-white': options?.clef == 'alto',
                                }" class="py-1 px-4 rounded w-full flex justify-between gap-4" :disabled="options?.clef == 'alto'"
                                    @click="setClef('alto')">
                                    <span class="font-semibold">
                                        Alto
                                    </span>
                                </button>
                            </div>
                        </BaseDropdown>
                    </label>
                    <label class="mr-2" v-if="sheetDetails && sheetDetails.instruments.length > 1">
                        <span class="text-sm text-gray-500">{{
                                $t('common_instruments')
                        }}</span>
                        <select class="p-2 rounded-md border-gray-300 pr-8" name="zoom" id="zoom" v-model="instruments"
                            multiple @change="load">
                            <option v-for="instrument in sheetDetails.instruments" :key="instrument"
                                :value="instrument">
                                {{ instrument }}
                            </option>
                        </select>
                    </label>
                    <label class="mr-2">
                        <span class="text-sm text-gray-500">{{ $t('common_size') }}</span>
                        <select class="p-2 rounded-md border-gray-300 pr-8" name="zoom" id="zoom" v-model="size"
                            @change="load">
                            <option :key="`size-sm`" value="sm">
                                Small
                            </option>
                            <option :key="`size-md`" value="md">
                                Medium
                            </option>
                            <option :key="`size-lg`" value="lg">
                                Large
                            </option>
                        </select>
                    </label>
                    <div class="">
                        <label class="text-sm text-gray-500">{{ $t('song_octave') }}</label>
                        <SongChanger :label="octave.toString()" @next="increaseOctave()" @previous="decreaseOctave()"
                            :hasNext="true" :hasPrevious="true" />
                    </div>
                </div>
            </div>
        </template>
        <Loader :loading="loading['transpose'] || loading['zoom'] || loading['octave']" :position="'local'" />
        <div id="osmd-svg"></div>
    </BaseCard>
</template>

<script lang="ts">
import { Collection, Song, transposer } from "@/classes";
import { useStore } from "@/store";
import { SongChanger } from "@/components/songs";
import { XIcon } from "@heroicons/vue/solid";
import { SheetMusicOptions } from "songtreasures";
import { sheetService } from "@/services/songs/sheetService";
import { Sheet } from "hiddentreasures-js";
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: "open-sheet-music-display",
    components: {
        SongChanger,
        XIcon,
    },
    props: {
        options: {
            type: Object as PropType<SheetMusicOptions>,
            required: true,
        },
        relativeKey: {
            type: String,
            required: true,
        },
        song: {
            type: Object as PropType<Song>,
        },
        collection: {
            type: Object as PropType<Collection>,
        },
        languageKey: {
            type: String,
            required: true,
        },
        showInfo: {
            type: Boolean,
        },
    },
    data() {
        const originalKey = this.options.originalKey;

        const transpositions = transposer.getTranspositions(originalKey, true);

        return {
            store: useStore(),
            svg: [] as string[],
            octave: 0,
            transposition: 0,
            size: "md" as "sm" | "md" | "lg" | "xl",
            sheetDetails: null as Sheet | null,
            instruments: [] as string[],
            loading: {} as {
                [key: string]: boolean
            },
            relativeTranspositions: transposer.getRelativeTranspositions(
                this.options.originalKey,
                this.relativeKey,
                transpositions,
            ),
        };
    },
    async mounted() {
        if (this.options.show) {
            this.transposition = this.options.transposition ?? 0;
            this.sheetDetails = await sheetService.get(this.options.fileId);
            await this.load();
        }
    },
    methods: {
        close() {
            if (this.options) {
                // eslint-disable-next-line vue/no-mutating-props
                this.$emit("close");
            }
        },
        async load() {
            if (this.options) {
                const octave = 12 * this.octave;
                const transposition =
                    this.transposition !== undefined
                        ? this.transposition + octave
                        : undefined;
                this.svg = (await sheetService.render({
                    id: this.options.fileId,
                    clef: this.options.clef,
                    format: "endless",
                    size: this.size,
                    transposition,
                    instruments: this.instruments.length ? this.instruments : undefined,
                })) as string[];

                const element = document.getElementById("osmd-svg");
                if (element) {
                    element.innerHTML = this.svg.join("\n");

                    element.childNodes.forEach(n => {
                        const node = n as HTMLElement;
                        node.removeAttribute("height");
                        node.removeAttribute("width");
                    });
                }
            }
        },
        async increaseOctave() {
            this.loading["octave"] = true;

            this.octave += 1;
            await this.load();

            this.loading["octave"] = false;
        },
        async decreaseOctave() {
            this.loading["octave"] = true;

            this.octave -= 1;
            await this.load();

            this.loading["octave"] = false;
        },
        async transpose(n: number) {
            this.loading["transpose"] = true;
            this.transposition = n;

            if (this.transposition == n) {
                await this.load();
            }
            this.loading["transpose"] = false;
        },
        async setClef(c: "bass" | "treble" | "alto") {
            if (this.options) {
                // eslint-disable-next-line vue/no-mutating-props
                this.options.clef = c;

                await this.load();
            }
        },
    },
    computed: {
        melodyOrigin() {
            return this.song?.melodyOrigin?.description?.default;
        },
        osmdDiv() {
            return document.getElementById("osmd-svg") as HTMLDivElement;
        },
        onSongViewer() {
            return this.$route.name === "song";
        },
    },
});
</script>

<style lang="scss">
@import '../style/mixins';

.shadow-scroll {
    @include scrollShadow(white);
}

.dark {
    .shadow-scroll {
        @include scrollShadow(#213f47);
    }
}

#osmd-svg {
    svg {
        width: unset !important;
        height: unset !important;
    }
}
</style>
