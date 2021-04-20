<template>
    <div class="playlists">
        <header class="playlists__header">
            <h1 class="playlists__title">
                {{ $t("common.your") }}
                {{ $t("common.playlists").toLowerCase() }}
            </h1>
            <div class="playlists__actions">
                <modal
                    theme="primary"
                    :label="$t('playlist.createnew')"
                    icon="plus"
                >
                    <form @submit.prevent="createPlaylist">
                        <base-input
                            :label="$t('common.name')"
                            v-model="playlistName"
                        />
                        <base-button theme="secondary" type="submit">
                            {{ $t("playlist.createnew") }}
                        </base-button>
                    </form>
                </modal>
            </div>
        </header>
        <div class="playlists__wrapper" v-if="playlists.length">
            <playlist-card
                v-for="playlist in playlists"
                :key="playlist.id"
                :playlist="playlist"
            />
        </div>
        <h3 class="playlists__noplaylists" v-else>
            {{ $t("playlist.noplaylists") }}
        </h3>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";

import { BaseButton, Modal } from "@/components";
import { BaseInput } from "@/components/inputs";
import { PlaylistCard } from "@/components/playlist";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";

@Options({
    name: "playlist-overview",
    components: {
        BaseButton,
        PlaylistCard,
        Modal,
        BaseInput,
    },
})
export default class PlaylistOverview extends Vue {
    private store = useStore();
    public playlistName = "";

    public createPlaylist() {
        this.store.dispatch(SessionActionTypes.PLAYLIST_CREATE, { name: this.playlistName });
        this.playlistName = "";
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

    &__noplaylists {
        opacity: 0.5;
        background-color: var(--st-color-background-medium);
        padding: var(--st-spacing);
        border-radius: var(--st-border-radius);
        text-align: center;
    }
}
</style>
