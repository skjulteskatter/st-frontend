<template>
    <base-card class="playlist-card">
        <strong class="playlist-card__title">{{ playlist.name }}</strong>
        <div class="playlist-card__info">
            <small class="playlist-card__entries tag">
                {{ playlist.entries.length }} {{ $t("common.songs") }}
            </small>
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
}
</script>

<style lang="scss" scoped>
.playlist-card {
    &__info {
        display: block;
    }
}
</style>