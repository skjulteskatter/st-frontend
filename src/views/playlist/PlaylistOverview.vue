<template>
    <div class="playlists">
        <header class="playlists__header">
            <h1 class="playlists__title">
                {{ $t("common.your") }}
                {{ $t("common.playlists").toLowerCase() }}
            </h1>
            <div class="playlists__actions">
                <base-button
                    theme="primary"
                    icon="plus"
                    @click="createPlaylist"
                >
                    {{ $t("playlist.createnew") }}
                </base-button>
            </div>
        </header>
        <div class="playlists__wrapper">
            <playlist-card
                v-for="playlist in playlists"
                :key="playlist.id"
                :playlist="playlist"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { BaseButton } from "@/components";
import PlaylistCard from "@/components/playlist/PlaylistCard.vue";
import { ApiPlaylist } from "dmb-api";

@Options({
    name: "playlist-overview",
    components: {
        BaseButton,
        PlaylistCard,
    },
})
export default class PlaylistOverview extends Vue {
    private store = useStore(sessionKey);

    public createPlaylist() {
        this.store.dispatch("createPlaylist", { name: "This is a test" });
    }

    public get playlists(): ApiPlaylist[] {
        return this.store.getters.playlists;
    }
}
</script>

<style lang="scss" scoped>
.playlists {
    &__wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);
    }

    &__title {
        margin-top: 0;
    }

    &__header {
        display: flex;
        justify-content: space-between;
    }
}
</style>