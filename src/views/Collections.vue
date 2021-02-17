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
            <collection-card
                v-for="col in collections"
                :key="col.key"
                :collection="col"
            ></collection-card>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseButton, CollectionCard } from "@/components";
import { sessionKey } from "@/store";
import { useStore } from "vuex";

@Options({
    components: {
        CollectionCard,
        BaseButton,
    },
})
export default class Collections extends Vue {
    private sessionStore = useStore(sessionKey);

    public get collections() {
        return this.sessionStore.state.collections ?? [];
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

        @media screen and (max-width: 1000px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    }
}
</style>