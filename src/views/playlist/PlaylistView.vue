<template>
    <div v-if="playlist">
        <back-button />
        <header class="flex justify-between items-start mb-4">
            <span>
                <h1 class="font-bold text-xl">{{ playlist.name }}</h1>
                <span class="text-gray-500">
                    {{ playlist.entries.length }}
                    {{ $t("common.songs").toLowerCase() }}
                </span>
            </span>
            <base-button icon="trash" theme="error" @click="deletePlaylist">
                {{ $t("playlist.delete") }}
            </base-button>
        </header>
        <h2 v-if="!playlist.entries.length" class="opacity-50">
            {{ $t("playlist.nosongs") }}
        </h2>
        <div class="flex flex-col gap-4" v-else>
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
import { BackButton, BaseCard } from "@/components";
import { PlaylistSongCard } from "@/components/playlist";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";
import { notify } from "@/services/notify";

@Options({
    name: "playlist-view",
    components: {
        BackButton,
        BaseCard,
        PlaylistSongCard,
    },
})
export default class PlaylistView extends Vue {
    private store = useStore();

    public async deletePlaylist() {
        const name = this.playlist?.name;

        await this.store.dispatch(
            SessionActionTypes.PLAYLIST_DELETE,
            this.playlist?.id,
        );
        this.$router.push("/playlists");

        notify("success",  this.$t("playlist.deletedplaylist"), "trash", `${this.$t("playlist.deletedplaylist")} "${name}"`);
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
