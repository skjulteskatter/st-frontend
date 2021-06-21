<template>
    <div class="flex">
        <div class="p-4 border-t border-b border-gray-300 bg-white flex items-center gap-4 w-full dark:bg-secondary dark:border-none">
            <loader :loading="osmdLoading || loading['transpose'] || loading['zoom']" :position="'local'">
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
                            :key="`zoom-${i+4}`"
                            :value="(i+4)/10"
                        >
                            {{ (i+4)*10 }}%
                        </option>
                    </select>
                </label>
                <base-button 
                    v-if="$route.name == 'song'"
                    theme="error"
                    icon="error"
                    @click="close()"
                    class="ml-auto"
                >{{$t('common.close')}}</base-button>
            </loader>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { osmd } from "@/services/osmd";
import { transposer } from "@/classes";

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
    public osmd = osmd;
    public originalKey?: string;
    public transposition = 0;
    public relativeKey?: string;
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

    public async mounted() {
        this.options ??= { show: false, originalKey: "C" };
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
}
</script>
