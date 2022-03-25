<template>
    <div v-if="loaded">
        <router-view />
    </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "collection-lists",
    components: {
        // BackButton,
    },
    data() {
        return {
            loaded: false,
        };
    },
});
</script>
