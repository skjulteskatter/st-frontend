<template>
    <div class="relative p-4 border-t border-b border-gray-300 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full dark:bg-secondary dark:border-none">
        <Loader :loading="osmdLoading || loading['transpose'] || loading['zoom'] || loading['octave']" :position="'local'">
            <div v-if="song && collection">
                <h2 class="text-xl font-bold">{{ song.getName(languageKey) }}</h2>
                <div class="flex gap-2 items-center opacity-50 tracking-wide">
                    <small v-if="collection.name">{{ collection.getName(languageKey) }} {{ song.getNumber(collection.id) }}</small>
                    <span>&middot;</span>
                    <small v-if="song.verses">{{ song.verses }} {{ $t('song_verses').toLocaleLowerCase() }}</small>
                </div>
                <div class="flex flex-col mt-2">
                    <small v-if="song.Authors.length">{{(song.yearWritten ? $t('song_writtenInBy').replace('$year', song.yearWritten.toString()) : $t('song_writtenBy')).replace('$authors', song.Authors.map(c => c.name).join(", "))}}</small>
                    <small v-if="song.Composers.length">{{(song.yearComposed ? $t('song_composedInBy').replace('$year', song.yearComposed.toString()) : $t('song_composedBy')).replace('$composers', song.Composers.map(c => c.name).join(", "))}}</small>
                    <small v-else>{{$t('song_unknownComposer')}}</small>
                </div>
                <div class="text-gray-600" v-if="melodyOrigin">
                    <small>{{melodyOrigin}}</small>
                </div>
            </div>
            <div class="flex">
                <label class="flex flex-col mr-2">
                    <span class="text-sm text-gray-500">{{ $t('song_key') }}</span>
                    <BaseDropdown
                        origin="left"
                        :label="
                            relativeTranspositions.find(
                                (r) => r.value == transposition
                            )?.view ?? $t('song_transpose')
                        "
                        class="flex flex-col"
                    >
                        <div class="max-h-64 overflow-y-auto shadow-scroll">
                            <button
                                :class="{
                                    'bg-primary text-white': transposition == t.value,
                                    'bg-gray-200 dark:bg-gray-800': options?.originalKey == t.original && transposition != t.value
                                }"
                                class="py-1 px-4 rounded w-full flex justify-between gap-4"
                                v-for="t in relativeTranspositions"
                                :key="t.key"
                                :disabled="transposition == t.value"
                                @click="transpose(t.value)"
                            >
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
                <label class="flex flex-col mr-2">
                    <span class="text-sm text-gray-500">{{ $t('song_clef') }}</span>
                    <BaseDropdown
                        origin="left"
                        :label="options?.clef"
                        class="flex flex-col"
                    >
                        <div class="max-h-64 overflow-y-auto shadow-scroll">
                            <button
                                :class="{
                                    'bg-primary text-white': options?.clef == 'bass',
                                }"
                                class="py-1 px-4 rounded w-full flex justify-between gap-4"
                                :disabled="options?.clef == 'bass'"
                                @click="setClef('bass')"
                            >
                                <span class="font-semibold">
                                    Bass
                                </span>
                            </button>
                            <button
                                :class="{
                                    'bg-primary text-white': options?.clef == 'treble',
                                }"
                                class="py-1 px-4 rounded w-full flex justify-between gap-4"
                                :disabled="options?.clef == 'treble'"
                                @click="setClef('treble')"
                            >
                                <span class="font-semibold">
                                    Treble
                                </span>
                            </button>
                            <button
                                :class="{
                                    'bg-primary text-white': options?.clef == 'alto',
                                }"
                                class="py-1 px-4 rounded w-full flex justify-between gap-4"
                                :disabled="options?.clef == 'alto'"
                                @click="setClef('alto')"
                            >
                                <span class="font-semibold">
                                    Alto
                                </span>
                            </button>
                        </div>
                    </BaseDropdown>
                </label>
                <label class="flex flex-col mr-2">
                    <span class="text-sm text-gray-500">{{ $t('common_size') }}</span>
                    <select
                        class="p-2 rounded-md border-gray-300 pr-8"
                        name="zoom"
                        id="zoom"
                        v-model="zoom"
                        @change="setZoom"
                    >
                        <option
                            v-for="i in 10"
                            :key="`zoom-${i+3}`"
                            :value="(i+3)/10"
                        >
                            {{ (i+3)*10 }}%
                        </option>
                    </select>
                </label>
                <label class="flex flex-col">
                    <small class="text-sm text-gray-500">{{ $t('song_octave') }}</small>
                    <SongChanger 
                        :label="octave.toString()" 
                        @next="increaseOctave()" 
                        @previous="decreaseOctave()"
                        :hasNext="true"
                        :hasPrevious="true"
                    />
                </label>
                <button
                    v-if="$route.name == 'song'"
                    class="absolute top-4 right-4 text-red-700"
                    @click="close()"
                >
                    <XIcon class="w-4 h-4" />
                </button>
            </div>
        </Loader>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { osmd } from "@/services/osmd";
import { Collection, transposer } from "@/classes";
import { useStore } from "@/store";
import { SongChanger } from "@/components/songs";
import { XIcon } from "@heroicons/vue/solid";
import { SheetMusicOptions } from "songtreasures";

@Options({
    props: {
        options: {
            type: Object,
        },
        relativeKey: {
            type: String,
        },
    },
    components: {
        SongChanger,
        XIcon,
    },
    name: "OSMD",
})
export default class OSMD extends Vue {
    public store = useStore();
    public osmd = osmd;
    public originalKey?: string;
    public transposition = 0;
    public relativeKey?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public zoom = 1;
    public options?: SheetMusicOptions;
    public octave = 0;
    
    public loading: {
        [key: string]: boolean;
    } = {};

    public relativeTranspositions: {
        value: number;
        view: string;
        key: string;
        original: string;
    }[] = [];

    public get melodyOrigin() {
        return (
            this.song?.melodyOrigin?.description?.[this.languageKey] ??
            this.song?.melodyOrigin?.description?.no ??
            undefined
        );
    }

    public async mounted() {
        this.options ??= { show: false, originalKey: "C", clef: "treble" };
        this.transposition = this.options.transposition ?? 0;
        this.zoom = this.osmd.zoom;
        const c = document.getElementById("osmd-canvas");

        const originalKey = this.options.originalKey;

        const transpositions = transposer.getTranspositions(originalKey, true);

        this.relativeTranspositions = transposer.getRelativeTranspositions(this.options.originalKey ?? "C", this.relativeKey ?? "C", transpositions);

        await this.osmd.init(c, null);

        try {
            await this.osmd.load(this.options);
        } catch (e) {
            //console.log(e);
        }
    }

    public async setClef(c: "bass" | "treble" | "alto") {
        if (this.options) {
            this.options.clef = c;

            await this.osmd.load(this.options);
        }
    }

    public close() {
        if (this.options)
            this.options.show = false;
    }

    public get osmdLoading() {
        return this.osmd.loading;
    }

    public async increaseOctave() {
        this.loading["octave"] = true;

        this.octave += 1;
        this.osmd.increaseOctave();

        this.loading["octave"] = false;
    }

    public async decreaseOctave() {
        this.loading["octave"] = true;

        this.octave -= 1;
        this.osmd.decreaseOctave();

        this.loading["octave"] = false;
    }

    public async transpose(n: number) {
        this.loading["transpose"] = true;
        this.transposition = n;

        if (this.transposition == n) {
            await new Promise(resolve => {
                setTimeout(resolve, 10);
            });
            this.osmd.transpose(n);
        }
        this.loading["transpose"] = false;
    }

    public async setZoom() {
        this.loading["zoom"] = true;
        const n = this.zoom;

        if (this.zoom == n) {
            await new Promise(resolve => {
                setTimeout(resolve, 10);
            });

            this.osmd.zoom = this.zoom;
            this.osmd.rerender();
        }
        this.loading["zoom"] = false;
    }

    public get song() {
        return this.collection?.songs.find(s => s.id == this.store.state.songs.songId);
    }

    public get collection(): Collection | undefined {
        return this.store.getters.collection;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
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
