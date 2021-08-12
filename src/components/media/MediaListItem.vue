<template>
    <div class="flex flex-col gap-2">
        <button
            class="cursor-pointer p-2 rounded-md border border-gray-300 hover:border-gray-500 flex focus:ring focus:ring-primary focus:outline-none dark:border-gray-500 dark:hover:border-gray-400"
            v-for="file in Files"
            :key="file.id"
            @click="callback ? callback(file) : undefined"
        >
            <MusicNoteIcon v-if="type == 'sheetmusic'" class="w-4 h-4 opacity-50" />
            <VolumeUpIcon v-if="type == 'audio'" class="w-4 h-4 opacity-50" />
            <small class="flex flex-col items-start text-left ml-2 w-full">
                <p class="w-full flex gap-4 justify-between">
                    {{ file.name }}
                    <span class="text-xs text-primary tracking-wide">
                        {{ file.type.endsWith("pdf") ? "PDF" : ""}}
                        {{ file.type.endsWith("sibelius") ? "Sibelius" : ""}}
                    </span>
                </p>
                <span class="opacity-50" v-if="file.category && file.category != 'probackmusic'">{{ $t(`types.${file.category}`) }}</span>
            </small>
        </button>
    </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { MediaFile } from "dmb-api";
import { Options, Vue } from "vue-class-component";
import { MusicNoteIcon, VolumeUpIcon } from "@heroicons/vue/solid";

@Options({
    name: "media-playlist",
    props: {
        type: {
            type: String,
            enum: ["sheetmusic", "audio"],
            default: "sheetmusic",
        },
        files: {
            type: Array,
            required: true,
        },
        callback: {
            type: Function,
        },
    },
    components: {
        MusicNoteIcon,
        VolumeUpIcon,
    },
})
export default class MediaListItem extends Vue {
    public store = useStore();
    public type?: string;
    public files?: MediaFile[];
    public callback?: Function;

    public get Files() {
        return this.files ?? [];
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>
