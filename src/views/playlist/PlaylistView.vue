<template>
    <div class="playlist-view">
        <back-button />
        <header class="playlist-view__header">
            <span>
                <h1 class="playlist-view__title">{{ playlist.name }}</h1>
                <span class="playlist-view__count">
                    {{ playlist.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </span>
            </span>
        </header>
        <h2 v-if="!playlist.entries.length" class="playlist-view__nosongs">
            {{ $t("playlist.nosongs") }}
        </h2>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BackButton } from "@/components";

@Options({
    name: "playlist-view",
    components: {
        BackButton,
    },
})
export default class PlaylistView extends Vue {
    private store = useStore(sessionKey);

    public get playlist() {
        return this.store.state.playlists.find(
            (p) => p.id == this.$route.params.id
        );
    }
}
</script>

<style lang="scss" scoped>
.playlist-view {
    &__title {
        margin: 0 0 0.2em 0;
    }

    &__count {
        opacity: 0.6;
    }

    &__header {
        display: flex;
        justify-content: space-between;
    }

    &__nosongs {
        opacity: 0.5;
    }
}
</style>
