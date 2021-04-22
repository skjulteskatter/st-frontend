<template>
    <base-card class="activity-feed">
        <h3 class="activity-feed__title">
            {{ $t("common.activity") }}
        </h3>
        <div v-if="activitiesInitialized">
            <div class="activity-feed__activities" v-if="activities.length">
                <router-link
                    class="activity-feed__activity clickable"
                    v-for="(a, i) in activities"
                    :key="a.id ?? i"
                    :to="a.getRouterLink(collections)"
                >
                    <img
                        :src="a.getImage(collections)"
                        class="activity-feed__activity__image"
                    />
                    <span class="activity-feed__activity__title">
                        <small>{{ $t(`song.${a.type}`) }}</small>
                        <strong>
                            {{ a.getName(languageKey) }}
                        </strong>
                    </span>
                    <span class="activity-feed__activity__timestamp">
                        {{ a.timeSince(languageKey) }}
                    </span>
                </router-link>
            </div>
            <p class="activity-feed__fallback" v-else>
                {{ $t("dashboard.noactivity") }}
            </p>
        </div>
        <div v-else class="loader"></div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";

import { BaseCard } from "@/components";

@Options({
    name: "activity-feed",
    components: {
        BaseCard,
    },
})
export default class ActivityFeed extends Vue {
    private store = useStore();

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collections() {
        return this.store.state.session.collections;
    }

    public get activitiesInitialized() {
        return this.store.state.session.activities != undefined;
    }

    public get activities() {
        return this.store.getters.activities;
    }
}
</script>

<style lang="scss" scoped>
.activity-feed {
    &__fallback {
        background-color: var(--st-color-background-dark);
        border-radius: var(--st-border-radius);
        padding: var(--st-spacing);
        margin: 0;
        text-align: center;
    }

    &__title {
        display: block;
        margin-top: 0;
    }

    &__activities {
        display: flex;
        flex-direction: column;
        gap: 0.5em;

        //max-height: 20rem;
        overflow-y: hidden;
        position: relative;
    }

    &__activity {
        margin: 0;
        display: block;
        padding: 0.5em;
        border-radius: var(--st-border-radius);
        background-color: var(--st-color-background-light);
        text-decoration: none;
        color: currentColor;
        font-size: 0.8em;

        display: flex;
        justify-content: space-between;
        gap: calc(var(--st-spacing) / 2);

        &__title {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;

            small {
                color: var(--st-color-primary);
            }
        }

        &__timestamp {
            flex-shrink: 0;
            opacity: 0.5;
            font-size: 0.9em;
        }

        &__image {
            max-height: 3em;
            border-radius: var(--st-border-radius);
        }
    }
}
</style>
