<template>
    <div class="flex flex-col gap-2">
        <button
            class="cursor-pointer p-2 rounded-md hover:bg-black/5 flex focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none dark:hover:bg-white/10"
            v-for="file in files"
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
                <span class="opacity-50" v-if="file.category && file.category != 'probackmusic'">{{ $t(`types_${file.category}`) }}</span>
            </small>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { useStore } from "@/store";
import { IMediaFile } from "songtreasures";
import { MusicNoteIcon, VolumeUpIcon } from "@heroicons/vue/solid";

export default defineComponent({
    name: "media-playlist",
    props: {
        type: {
            type: String,
            enum: ["sheetmusic", "audio"],
            default: "sheetmusic",
        },
        files: {
            type: Array as PropType<IMediaFile[]>,
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
    data: () => ({
        store: useStore(),
    }),
    computed: {
        languageKey() {
            return this.store.getters.languageKey;
        },
    },
});
</script>
