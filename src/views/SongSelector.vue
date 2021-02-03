<template>
    <div class="view-song">
        <router-view />
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { songKey, sessionKey } from "@/store";

@Options({})
export default class SongSelector extends Vue {
    private songStore = useStore(songKey);

    public async mounted() {
        if (
            this.$route.name != "collections" &&
            this.$route.params.collection
        ) {
            await this.songStore.dispatch(
                "selectCollection",
                this.$route.params.collection
            );
        }
    }

    public get selectedCollection() {
        return useStore(songKey).getters.collection;
    }
    public get selectedSong() {
        return useStore(songKey).getters.song;
    }
    public get language() {
        return useStore(sessionKey).getters.currentUser?.settings?.languageKey;
    }
}
</script>

<style lang="scss" scoped>
</style>
