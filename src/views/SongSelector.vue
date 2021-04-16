<template>
    <div class="view-song">
        <router-view />
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { songKey } from "@/store";

@Options({
    name: "song-selector",
})
export default class SongSelector extends Vue {
    private songStore = useStore(songKey);

    public async mounted() {
        if (
            this.$route.name != "collections" &&
            this.$route.params.collection
        ) {
            await this.songStore.dispatch(
                "selectCollection",
                this.$route.params.collection,
            );
        }
    }
}
</script>

<style lang="scss" scoped>
.view-song {
    height: 100%;
}
</style>
