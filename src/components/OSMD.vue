<template>
    <div class="flex">
        <div class="relative p-4 border-t border-b border-gray-300 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full dark:bg-secondary dark:border-none">
            <loader :loading="osmdLoading || loading['transpose'] || loading['zoom']" :position="'local'">
                <div v-if="song && collection">
                    <h2 class="text-xl font-bold">{{ song.getName(languageKey) }}</h2>
                    <div>
                        <small v-if="collection.name" class="text-gray-500">{{ collection.getName(languageKey) }} {{ song.getNumber(collection.id) }}</small>
                        <small v-if="song.verses" class="text-gray-400 rounded p-1 border border-gray-400 ml-4">{{ song.verses }} {{ $t('song.verses').toLocaleLowerCase() }}</small>
                    </div>
                    <div class="flex flex-col mt-2">
                        <small v-if="song.Authors.length">{{(song.yearWritten ? $t('song.writtenInBy').replace('$year', song.yearWritten.toString()) : $t('song.writtenBy')).replace('$authors', song.Authors.map(c => c.name).join(", "))}}</small>
                        <small v-if="song.Composers.length">{{(song.yearComposed ? $t('song.composedInBy').replace('$year', song.yearComposed.toString()) : $t('song.composedBy')).replace('$composers', song.Composers.map(c => c.name).join(", "))}}</small>
                    </div>
                    <div class="text-gray-600" v-if="melodyOrigin">
                        <small>{{melodyOrigin}}</small>
                    </div>
                </div>
                <div class="flex gap-4">
                    <label class="flex flex-col">
                        <span class="text-sm text-gray-500">{{ $t('song.key') }}</span>
                        <base-dropdown
                            origin="left"
                            :label="
                                relativeTranspositions.find(
                                    (r) => r.value == transposition
                                )?.view ?? 'Transpose'
                            "
                            class="flex flex-col"
                        >
                            <div class="max-h-64 overflow-y-auto">
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
                        </base-dropdown>
                    </label>
                    <label class="flex flex-col">
                        <span class="text-sm text-gray-500">{{ $t('song.clef') }}</span>
                        <base-dropdown
                            origin="left"
                            :label="options?.clef"
                            class="flex flex-col"
                        >
                            <div class="max-h-64 overflow-y-auto">
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
                        </base-dropdown>
                    </label>
                    <label class="flex flex-col">
                        <span class="text-sm text-gray-500">{{ $t('common.size') }}</span>
                        <select
                            class="p-2 rounded border-gray-300 pr-8"
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
                    <button
                        v-if="$route.name == 'song'"
                        class="absolute top-4 right-4 text-red-700"
                        @click="close()"
                    >
                        <icon name="error" />
                    </button>
                </div>
            </loader>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { osmd } from "@/services/osmd";
import { Collection, transposer } from "@/classes";
import { useStore } from "@/store";

@Options({
    props: {
        options: {
            type: Object,
        },
        relativeKey: {
            type: String,
        },
    },
    name: "OSMD",
})
export default class OSMD extends Vue {
    public store = useStore();
    public osmd = osmd;
    public originalKey?: string;
    public transposition = 0;
    public relativeKey?: string;
    public clefs: ("bass" | "treble" | "alto")[] = ["bass", "treble", "alto"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public playbackControl: any;
    public zoom = 1;
    public createdDone = false;
    public options?: SheetMusicOptions;
    
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
