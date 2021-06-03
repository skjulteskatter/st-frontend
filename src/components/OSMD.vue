<template>
    <div class="flex">
        <div class="p-4 border-t border-b border-gray-300 bg-white flex items-center gap-4 w-full">
            <loader :loading="osmdLoading" :position="'local'">
                <base-dropdown
                    origin="left"
                    :label="
                        relativeTranspositions.find(
                            (r) => r.value == transposition
                        )?.view ?? 'Transpose'
                    "
                    class="flex flex-col"
                >
                    <button
                        :class="{
                            'bg-primary text-white': transposition == t.value,
                            'bg-gray-200': options.originalKey == t.view && transposition != t.value
                        }"
                        class="py-1 px-4 rounded w-full"
                        v-for="t in relativeTranspositions"
                        :key="t.key"
                        :disabled="transposition == t.value"
                        @click="transpose(t.value)"
                    >
                        {{ t.view }}
                    </button>
                </base-dropdown>
                <div class="flex flex-col max-w-xs w-full rounded p-2 border border-gray-300">
                    <small class="flex justify-between gap-4">
                        <span class="text-gray-500">Zoom:</span>
                        <span class="font-bold">{{ Math.floor(zoom * 100) }}%</span>
                    </small>
                    <input
                        type="range"
                        v-model="zoom"
                        @change="setZoom"
                        min="0.4"
                        max="1.4"
                        step="0.1"
                        class="w-full"
                    />
                </div>
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
    public loading: string[] = [];
    public options?: SheetMusicOptions;

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

    public transpose(n: number) {
        this.osmd.loading = true;
        this.transposition = n;
        // setTimeout(() => {
            if (this.transposition == n) {
                this.osmd.transpose(n);
            }
        // }, 500);
        this.osmd.loading = false;
    }

    public setZoom() {
        const n = this.zoom;

        // setTimeout(() => {
            if (this.zoom == n) {
                this.osmd.zoom = this.zoom;
                this.osmd.rerender();
            }
        // }, 500);
    }
}
</script>
