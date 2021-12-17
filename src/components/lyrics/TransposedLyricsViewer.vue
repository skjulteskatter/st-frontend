<template>
    <div v-if="lyrics">
        <VerseView v-for="(v, i) in lyrics.versesWithChords" :verse="v" :key="i" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { Lyrics } from "@/classes";
import VerseView from "./VerseView.vue";

export default defineComponent({
    name: "transposed-lyrics-viewer",
    components: {
        VerseView,
    },
    props: {
        lyrics: {
            type: Object as PropType<Lyrics>,
        },
    },
});
</script>
