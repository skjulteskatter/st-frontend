<template>
    <div class="dashboard" v-if="user">
        <h1 class="dashboard__title">
            {{ $t("common.welcome") }}, {{ user.displayName }}
        </h1>
        <div class="dashboard__wrapper">
            <!-- <div class="dashboard__subscriptions">
                <h3 class="dashboard__subscriptions__title">
                    <span>
                        {{ $t("common.your") }}
                        {{ $t("common.subscriptions").toLowerCase() }}
                    </span>
                    <Icon name="book" />
                </h3>
                <div class="dashboard__subscriptions__cards">
                    <collection-card
                        v-for="sub in subscribedCollections"
                        :key="sub"
                        :collection="sub"
                    ></collection-card>
                </div>
            </div> -->
            <activity-feed />
            <recent-collections />
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";

import { BaseButton, CollectionCard } from "@/components";
import { ActivityFeed, RecentCollections } from "@/components/dashboard";

@Options({
    name: "dashboard",
    components: {
        BaseButton,
        CollectionCard,
        ActivityFeed,
        RecentCollections,
    },
})
export default class Dashboard extends Vue {
    public store = useStore();

    public get user(): User | undefined {
        return this.store.getters.user;
    }
}
</script>

<style lang="scss">
@import "../style/mixins";

.dashboard {
    padding: calc(var(--st-spacing) * 2);
    display: flex;
    flex-direction: column;
    gap: var(--st-spacing);

    @include breakpoint("medium") {
        padding: var(--st-spacing);
    }

    &__wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
        gap: var(--st-spacing);
    }

    &__title {
        margin: 0;
    }

    &__subscriptions {
        &__title {
            display: flex;
            align-items: center;
            gap: calc(var(--st-spacing) / 2);
            margin: 0 0 calc(var(--st-spacing) / 2) 0;
        }

        &__cards {
            display: grid;
            grid-template-columns: repeat(7, minmax(100px, 1fr));
            grid-gap: var(--st-spacing);
            overflow-x: auto;

            @include breakpoint("small") {
                overflow-x: scroll;
            }
        }
    }
}

.user-info {
    margin-bottom: var(--st-spacing);

    &__wrapper {
        display: flex;
        flex-direction: column;
    }

    label {
        opacity: 0.6;
        font-size: 0.8em;
    }

    * {
        margin: 0;
    }

    &__name {
        margin-bottom: 0.2em;
    }

    &__field {
        &:not(:last-child) {
            margin-bottom: var(--st-spacing);
        }
    }
}
</style>
