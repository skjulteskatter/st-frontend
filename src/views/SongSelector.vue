<template>
    <router-view />
</template>

<script lang="ts">
import { useStore } from "@/store";
import { SongsActionTypes } from "@/store/modules/songs/action-types";
import { Vue, Options } from "vue-class-component";

@Options({
    name: "song-selector",
})
export default class SongSelector extends Vue {
    private store = useStore();

    public async mounted() {
        if (
            this.$route.name != "collections" &&
            this.$route.params.collection
        ) {
            await this.store.dispatch(
                SongsActionTypes.SELECT_COLLECTION,
                this.$route.params.collection as string,
            );
        }
    }
}
</script>
