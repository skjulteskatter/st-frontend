<template>
    <base-card class="playlist-card clickable" @click="goToPlaylist">
        <strong class="playlist-card__title">{{ playlist.name }}</strong>
        <div class="playlist-card__info">
            <small class="playlist-card__entries">
                {{ playlist.entries.length }}
                {{ $t("common.songs").toLowerCase() }}
            </small>
            <!-- <small class="playlist-card__shared">
                {{ $t("playlist.sharedwith") }}
                {{ playlist.sharedWithIds.length }}
            </small> -->
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { ApiPlaylist } from "dmb-api";
import { BaseCard } from "@/components";

@Options({
    props: {
        playlist: {
            type: Object,
            required: true,
        },
    },
    components: {
        BaseCard,
    },
})
export default class PlaylistCard extends Vue {
    public playlist: ApiPlaylist = {} as ApiPlaylist;

    public goToPlaylist() {
        if (!this.playlist.id) return;

        this.$router.push({
            name: "playlist-view",
            params: { id: this.playlist.id },
        });
    }
}
</script>

<style lang="scss" scoped>
.playlist-card {
    &__info {
        margin-top: calc(var(--st-spacing) / 2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--st-spacing);
    }

    &__entries {
        margin: 0;
    }

    &__shared {
        opacity: 0.6;
    }
}
</style>
