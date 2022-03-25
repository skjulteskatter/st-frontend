<template>
    <router-view />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "song-selector",
    async mounted() {
        if (
            this.$route.name != "collections" &&
            this.$route.params.collection
        ) {
            await this.store.dispatch(
                SongsActionTypes.SELECT_COLLECTION,
                this.$route.params.collection as string,
            );
        }
    },
});
</script>
