<template>
    <div v-if="loaded">
        <router-view />
    </div>
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
