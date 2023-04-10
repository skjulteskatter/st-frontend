<template>
    <div v-if="loaded">
        <router-view />
    </div>
</template>
<script lang="ts">
import scriptures from "@/services/modules/scriptures";
import { defineComponent } from "vue";

export default defineComponent({
    name: "scriptures-route",
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
