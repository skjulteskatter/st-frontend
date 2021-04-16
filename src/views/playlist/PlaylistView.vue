<template>
    <div class="playlist-view" v-if="playlist">
        <back-button />
        <header class="playlist-view__header">
            <span>
                <h1 class="playlist-view__title">{{ playlist.name }}</h1>
                <span class="playlist-view__count">
                    {{ playlist.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </span>
            </span>
            <base-button icon="trash" theme="error" @click="deletePlaylist">
                {{ $t("playlist.delete") }}
            </base-button>
        </header>
        <h2 v-if="!playlist.entries.length" class="playlist-view__nosongs">
            {{ $t("playlist.nosongs") }}
        </h2>
        <div class="playlist-view__songs" v-else>
            <playlist-song-card
                v-for="entry in playlist.entries"
                :key="entry.id"
                :entry="entry"
                :playlist="playlist"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BackButton, BaseButton, BaseCard } from "@/components";
import { PlaylistSongCard } from "@/components/playlist";
import { useStore } from "@/store/typed";
import { SessionActionTypes } from "@/store/typed/modules/session/action-types";
import { NotificationActionTypes } from "@/store/typed/modules/notifications/action-types";

@Options({
    name: "playlist-view",
    components: {
        BackButton,
        BaseButton,
        BaseCard,
        PlaylistSongCard,
    },
})
export default class PlaylistView extends Vue {
    private store = useStore();

    public async deletePlaylist() {
        await this.store.dispatch(SessionActionTypes.PLAYLIST_DELETE, this.playlist?.id);
        this.$router.push("/playlists");

        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            title: this.$t("playlist.deletedplaylist"),
        });
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get playlist() {
        return this.store.getters.playlists.find(
            (p) => p.id == this.$route.params.id,
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
        align-items: flex-start;
        margin-bottom: var(--st-spacing);
    }

    &__nosongs {
        opacity: 0.5;
    }
}
</style>
