<template>
    <base-card class="overflow-visible">
        <template #header>
            <h3 class="font-bold">{{ $t("song.lyrics") }}</h3>
        </template>
        <div
            class="w-full cursor-pointer whitespace-pre-line mb-2 hover:bg-black/5 dark:hover:bg-white/10 p-2"
            v-for="(verse, i) in Text"
            :key="verse.name + verse.content[0] + i"
            :class="{
                'border-l-2 border-primary bg-primary/10': currentVerses?.includes((i + 1).toString()),
                'bg-red-500/10': !availableVerses?.includes((i + 1).toString()),
            }"
            @click="$emit('toggle', (i + 1).toString())"
        >
            <b class="text-sm mb-1 flex items-center gap-2">
                <CheckCircleIcon v-if="availableVerses?.includes((i + 1).toString())" class="w-5 h-5 text-green-500" />
                <MinusCircleIcon v-else class="w-5 h-5 text-red-500" />
                {{ verse.name }}
            </b>
            <p
                class="leading-7"
                :class="{ 'opacity-50 italic': !availableVerses?.includes((i + 1).toString()) }"
            >{{ verse.content.join("\n") }}</p>
        </div>
    </base-card>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
    TransposedLyricsViewer,
    LyricsViewer,
    TransposeDropdown,
    PrintButton,
} from "../lyrics";
import { SongChanger } from "@/components/songs";
import { CheckCircleIcon } from "@heroicons/vue/solid";
import { MinusCircleIcon } from "@heroicons/vue/outline";

@Options({
    components: {
        TransposedLyricsViewer,
        TransposeDropdown,
        LyricsViewer,
        PrintButton,
        SongChanger,
        CheckCircleIcon,
        MinusCircleIcon,
    },
    props: {
        song: {
            type: Object,
        },
        text: {
            type: Array,
        },
        availableVerses: {
            type: Array,
        },
        currentVerses: {
            type: Array,
        },
    },
    name: "lyrics-card",
    emits: [
        "toggleAll",
        "toggle",
        "mounted",
    ],
})
export default class LyricsCard extends Vue {
    public text?: {
        name: string;
        content: string[];
    }[];

    public mounted() {
        this.$emit("mounted");
    }

    public get Text() {
        return this.text ?? [];
    }

    public loaded = false;
    public unset = false;

    public availableVerses?: string[];

    public currentVerses?: string[];
}
</script>