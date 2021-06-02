<template>
    <base-dropdown
        :label="'Transpose ' + currentTransposition"
    >
        <base-button
            v-for="(key, i) in keys"
            :key="i"
            :disabled="currentTransposition == key"
            @click="transpose(transpositions ? transpositions[key] : 0)"
        >
            {{key}}
        </base-button>
    </base-dropdown>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";

@Options({
    name: "transpose-dropdown",
    props: {
        transpositions: {
            type: Object,
        },
        transpose: {
            type: Function,
        },
    },
})
export default class TransposeDropdown extends Vue {
    private store = useStore();

    public keys = ["Ab", "A", "A#", "Bb", "B", "C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#"];
    public transpositions?: {
        [key: string]: number;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public transpose = (n: number) => undefined;

    public get currentTransposition() {
        return Object.entries(this.transpositions ?? {}).find(e => e[1] == this.transposition)?.[0];
    }

    public get defaultTransposition() {
        return this.store.getters.user?.settings?.defaultTransposition ?? "C";
    }

    public get transposition() {
        return this.store.state.songs.transposition ?? 0;
    }
}
</script>
