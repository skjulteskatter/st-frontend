<template>
    <router-view />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";

export default defineComponent({
    name: "song-selector",
    data: () => ({
        store: useStore(),
    }),
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
