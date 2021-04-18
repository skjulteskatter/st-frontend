<template>
    <div class="view-song">
        <router-view />
    </div>
</template>
<script lang="ts">
import { useStore } from "@/store/typed";
import { SongsActionTypes } from "@/store/typed/modules/songs/action-types";
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

<style lang="scss" scoped>
.view-song {
    height: 100%;
}
</style>
