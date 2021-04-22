<template>
    <base-card>
        <div class="dashboard-playlists">
            <h3 class="dashboard-playlists__title">
                {{ $t("common.playlists") }}
            </h3>
            <div class="dashboard-playlists__playlists" v-if="playlists.length">
                <div
                    class="dashboard-playlists__playlist clickable"
                    v-for="p in playlists"
                    :key="p.id"
                >
                    <router-link
                        class="dashboard-playlists__playlist__link"
                        :to="playlistLink(p)"
                    >
                        <span class="dashboard-playlists__playlist__name">
                            {{ p.name }}
                        </span>
                        <small class="dashboard-playlists__playlist__entries">
                            {{ p.entries.length }}
                            {{ $t("common.songs").toLowerCase() }}
                        </small>
                    </router-link>
                </div>
            </div>
            <p class="dashboard-playlists__fallback" v-else>
                {{ $t("playlist.noplaylists") }}
            </p>
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { BaseCard } from "@/components";
import { useStore } from "@/store";
import { ApiPlaylist } from "dmb-api";

@Options({
    name: "dashboard-playlists",
    components: {
        BaseCard,
    },
})
export default class Playlists extends Vue {
    private store = useStore();

    public playlistLink(playlist: ApiPlaylist) {
        return {
            name: "playlist-view",
            params: {
                id: playlist.id,
            },
        };
    }

    public get playlists(): ApiPlaylist[] {
        return this.store.state.session.playlists;
    }
}
</script>

<style lang="scss" scoped>
.dashboard-playlists {
    &__fallback {
        background: var(--st-color-background-dark);
        padding: var(--st-spacing);
        text-align: center;
        border-radius: var(--st-border-radius);
        margin: 0;
    }

    &__title {
        margin-top: 0;
        display: flex;
        justify-content: space-between;
    }

    &__playlists {
        display: flex;
        flex-direction: column;
        gap: calc(var(--st-spacing) / 2);
    }

    &__playlist {
        padding: calc(var(--st-spacing) / 2);
        background: var(--st-color-background-light);
        border-radius: var(--st-border-radius);

        &__link {
            width: 100%;
            color: currentColor;
            text-decoration: none;
        }

        &__name {
            display: block;
        }

        &__entries {
            opacity: 0.5;
        }
    }
}
</style>