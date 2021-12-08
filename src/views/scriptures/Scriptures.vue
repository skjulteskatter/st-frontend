<template>
    <template v-if="loaded">
        <router-view />
    </template>
</template>
<script lang="ts">
import scriptures from "@/services/modules/scriptures";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "scriptures",
    async mounted() {
        await scriptures.initialize();
        this.loaded = true;
    },
    data() {
        return {
            loaded: false,
        };
    },
});
</script>
