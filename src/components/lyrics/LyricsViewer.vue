<template>
    <div class="columns-1 md:columns-2">
        <div
            class="flex-col w-full whitespace-pre-line mb-4 break-inside-avoid"
            v-for="(verse, i) in text"
            :key="i"
        >
            <b class="text-sm">{{ verse.name }}</b>
            <p class="leading-7" v-for="(line, i) in verse.content" :key="i">{{ line }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { useStore } from "@/store";
import { Lyrics } from "@/classes";

export default defineComponent({
    name: "lyrics-viewer",
    props: {
        lyrics: {
            type: Object as PropType<Lyrics>,
        },
    },
    data: () => ({
        store: useStore(),
    }),
    computed: {
        text() {
           return this.lyrics?.getText({
                chorus: this.$t("song_chorus"),
                bridge: this.$t("song_bridge"),
            }) ?? [];
        },
    },
});
</script>
