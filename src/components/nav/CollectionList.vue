<template>
    <div class="collection-list">
        <small class="collection-list__title">
            {{ $t("common.subscriptions") }}
        </small>
        <ul class="collection-list__list">
            <li v-for="collection in collections" :key="collection.id">
                <router-link
                    class="collection-list__link selectable"
                    :to="{
                        name: 'song-list',
                        params: { collection: collection.id },
                    }"
                    >{{ collection.name[languageKey] }}</router-link
                >
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { sessionKey } from "@/store";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";

@Options({})
export default class CollectionList extends Vue {
    private store = useStore(sessionKey);

    public get collections() {
        return this.store.getters.collections;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixins";

.collection-list {
    padding: var(--st-spacing);
    font-size: 0.9em;
    flex-grow: 1;

    @include breakpoint("medium") {
        display: none;
    }

    &__list {
        padding-left: 1em;
        line-height: 1.3em;
        font-weight: 300;
        margin-top: 0.5em;
        list-style: circle;
    }

    &__link {
        color: var(--st-color-text);
        display: block;
        text-decoration: none;

        &:hover {
            color: var(--st-color-primary);
        }
    }

    &__title {
        opacity: 0.6;
        text-transform: uppercase;
    }
}
</style>