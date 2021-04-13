<template>
    <div class="playlists">
        <header class="playlists__header">
            <h1 class="playlists__title">
                {{ $t("common.your") }}
                {{ $t("common.playlists").toLowerCase() }}
            </h1>
            <div class="playlists__actions">
                <base-button theme="secondary" icon="plus">
                    {{ $t("playlist.createnew") }}
                </base-button>
            </div>
        </header>
        <div class="playlists__wrapper">
            <base-card v-for="playlist in playlists" :key="playlist.id">
                <strong>{{ playlist.name }}</strong>
            </base-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "@/store";
import { BaseButton, BaseCard } from "@/components";
import { ApiPlaylist } from "dmb-api";

@Options({
    components: {
        BaseButton,
        BaseCard,
    },
})
export default class PlaylistOverview extends Vue {
    private store = useStore(sessionKey);

    public get playlists(): ApiPlaylist[] {
        return this.store.state.playlists;
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.playlists {
    padding: calc(var(--st-spacing) * 2);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
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