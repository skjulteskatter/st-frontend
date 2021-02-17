<template>
    <div class="songbooks">
        <div class="songbooks__header">
            <h1 class="songbooks__header__title">{{ $t("common.songs") }}</h1>
            <base-button
                @click="$router.push({ name: 'search' })"
                icon="search"
            >
                {{ $t("common.search") }}
            </base-button>
        </div>
        <div class="songbooks__body">
            <base-card
                v-for="songbook in collections"
                :key="songbook.key"
                class="songbooks__book clickable"
                :class="{
                    disabled: !available.find((c) => c.id == songbook.id),
                }"
                :image="songbook.image"
                @click="selectCollection(songbook)"
                border
            >
                <h3 class="songbooks__book__title">
                    {{ songbook.getName(languageKey) }}
                </h3>
            </base-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey, songKey } from "@/store";
import { BaseCard, BaseButton } from "@/components";
import { Collection } from "@/classes";

@Options({
    components: {
        BaseCard,
        BaseButton,
    },
})
export default class Collections extends Vue {
    private songStore = useStore(songKey);
    private sessionStore = useStore(sessionKey);

    public selectCollection(collection: Collection) {
        if (!this.available.find((c) => c.id == collection.id)) return;
        this.$router.push({
            name: "song-list",
            params: {
                collection: collection.key,
            },
        });
    }

    public get collections() {
        return this.sessionStore.state.collections ?? [];
    }

    public get selected() {
        return this.songStore.getters.collection ?? {};
    }

    public get available(): Collection[] {
        return this.sessionStore.getters.collections ?? [];
    }

    public get languageKey() {
        return this.sessionStore.getters.languageKey;
    }
}
</script>

<style lang="scss">
.songbooks {
    display: flex;
    flex-direction: column;
    gap: var(--st-spacing);
    padding: calc(var(--st-spacing) * 2);

    &__header {
        display: flex;
        justify-content: space-between;

        &__title {
            margin: 0;
        }
    }

    &__body {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: var(--st-spacing);

        @media screen and (max-width: 800px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media screen and (max-width: 500px) {
            grid-template-columns: 1fr;
        }
    }

    &__book {
        cursor: pointer;

        &__title {
            margin: 0;
        }

        &.selected {
            border: 2px solid var(--st-primary-color);
        }

        &.disabled {
            color: var(--st-border-color);
            cursor: not-allowed;
        }
    }
}
</style>