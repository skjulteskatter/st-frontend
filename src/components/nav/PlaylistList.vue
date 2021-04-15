<template>
    <div class="playlist-list">
        <small class="playlist-list__title">
            {{ $t("common.playlists") }}
            <router-link class="playlist-list__title__link" to="/playlists">
                {{ $t("playlist.seeall") }}
            </router-link>
        </small>
        <ul class="playlist-list__list" v-if="playlists.length > 0">
            <li v-for="playlist in playlists" :key="playlist.id">
                <router-link
                    class="playlist-list__link"
                    :to="{
                        name: 'playlist-view',
                        params: { id: playlist.id },
                    }"
                >
                    {{ playlist.name }}
                    <small>{{ playlist.entries.length }}</small>
                </router-link>
            </li>
        </ul>
        <p class="playlist-list__create" v-else>
            {{ $t("playlist.noplaylists") }}
        </p>
    </div>
</template>

<script lang="ts">
import { Collection } from "@/classes";
import { sessionKey } from "@/store";
import { ApiPlaylist } from "dmb-api";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseButton } from "@/components";

@Options({
    components: {
        BaseButton,
    },
})
export default class CollectionList extends Vue {
    private store = useStore(sessionKey);

    public get collections(): Collection[] {
        return this.store.getters.collections;
    }

    public get playlists(): ApiPlaylist[] {
        return this.store.state.playlists;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.playlist-list {
    margin-top: 1rem;
    padding: var(--st-spacing);
    font-size: 0.9em;
    flex-grow: 1;

    @include breakpoint("medium") {
        display: none;
    }

    &__list {
        font-weight: 300;
        padding: 0;
        margin-top: 0.5em;
        list-style: none;
    }

    &__create {
        padding: 0.5em var(--st-spacing);
        border-radius: var(--st-border-radius);
        background-color: var(--st-color-background-medium);
        color: currentColor;
        text-align: center;
    }

    &__link {
        color: var(--st-color-text);
        display: flex;
        justify-content: space-between;
        text-decoration: none;
        margin-bottom: 0.5em;
        padding: 0.5em;
        background-color: var(--st-color-background-medium);
        border: 1px solid var(--st-color-border);
        border-radius: var(--st-border-radius);

        &:hover {
            color: var(--st-color-primary);
            border: 1px solid var(--st-color-primary);
        }
    }

    &__title {
        text-transform: uppercase;
        // opacity: 0.6;
        display: flex;
        justify-content: space-between;

        &__link {
            color: inherit;
            font-weight: bold;

            &:hover {
                color: var(--st-color-primary);
            }
        }
    }
}
</style>