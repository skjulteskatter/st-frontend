<template>
    <div class="osmd-wrapper">
        <div class="flex">
            <div class="p-2 bg-white border border-gray-400 flex items-center gap-2 w-full">
                <loader :loading="osmdLoading" :position="'local'" />
                <base-dropdown
                        origin="left"
                        :label="
                            relativeTranspositions.find(
                                (r) => r.value == transposition
                            )?.view ?? 'Transpose'
                        "
                >
                    <button
                        :class="[
                            transposition == t.value
                                ? 'bg-gray-100'
                                : '',
                        ]"
                        v-for="t in relativeTranspositions"
                        :key="t.key"
                        :disabled="transposition == t.value"
                        @click="transpose(t.value)"
                    >
                        {{ t.view }}
                    </button>
                </base-dropdown>
                <div class="flex flex-col w-40">
                    <small>{{ Math.floor(zoom * 100) }}%</small>
                    <input
                        type="range"
                        v-model="zoom"
                        @change="setZoom"
                        min="0.4"
                        max="1.4"
                        step="0.1"
                    />
                </div>
                <Icon
                    v-if="$route.name == 'song'"
                    name="error"
                    class="ml-auto cursor-pointer text-red-700"
                    @click="close()"
                />
            </div>
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
    public relativeKey = "C";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public playbackControl: any;
    public zoom = 1;
    public createdDone = false;
    public loading: string[] = [];
    public options: SheetMusicOptions = { show: false, originalKey: "C" };

    public relativeTranspositions: {
        value: number;
        view: string;
        key: string;
        original: string;
    }[] = [];

    public async mounted() {
        this.transposition = this.options.transposition ?? 0;
        this.zoom = this.osmd.zoom;
        const c = document.getElementById("osmd-canvas");

        const originalKey = this.options.originalKey;

        const transpositions = transposer.getTranspositions(originalKey, true);

        this.relativeTranspositions = transposer.getRelativeTranspositions(this.options.originalKey ?? "C", this.relativeKey, transpositions);

        await this.osmd.init(c, null);

        try {
            await this.osmd.load(this.options);
        } catch (e) {
            //console.log(e);
        }
    }

    public close() {
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
