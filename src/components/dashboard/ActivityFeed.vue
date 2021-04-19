<template>
    <base-card class="activity-feed">
        <h3 class="activity-feed__title">
            {{ $t("common.activity") }}
        </h3>
        <div class="activity-feed__activities" v-if="activities.length">
            <router-link
                class="activity-feed__activity"
                v-for="(activity, i) in activities"
                :key="activity.id ?? i"
                :to="{
                    name: 'song',
                    params: {
                        collection: activity.song?.collection?.key,
                        number: activity.song?.number,
                    },
                }"
            >
                {{ activity.song?.getName(languageKey) }}
                <span class="activity-feed__activity__timestamp">
                    {{ timeSince(activity.loggedDate) }}
                </span>
            </router-link>
        </div>
        <p class="activity-feed__fallback" v-else>
            {{ $t("dashboard.noactivity") }}
        </p>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Song } from "@/classes";
import { useStore } from "@/store/typed";

import { BaseCard } from "@/components";

@Options({
    name: "activity-feed",
    components: {
        BaseCard,
    },
})
export default class ActivityFeed extends Vue {
    private store = useStore();

    public timeSince(date: string) {
        const rtfl = new Intl.RelativeTimeFormat(this.languageKey, {
            localeMatcher: "best fit",
            numeric: "auto",
            style: "short",
        });

        const now = new Date().getTime();
        const then = new Date(date).getTime();

        const units: { unit: Intl.RelativeTimeFormatUnit; amount: number }[] = [
            { unit: "year", amount: 31536000000 },
            { unit: "month", amount: 2628000000 },
            { unit: "day", amount: 86400000 },
            { unit: "hour", amount: 3600000 },
            { unit: "minute", amount: 60000 },
            { unit: "second", amount: 1000 },
        ];

        const relatime = (elapsed: number) => {
            for (const { unit, amount } of units) {
                if (Math.abs(elapsed) > amount || unit === "second") {
                    return rtfl.format(Math.round(elapsed / amount), unit);
                }
            }
        };

        return relatime(then - now);
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get activities() {
        return this.store.state.session.activities.map((a) => {
            return {
                id: a.id,
                song: a.song ? new Song(a.song) : undefined,
                loggedDate: a.loggedDate,
            };
        });
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

        max-height: 20rem;
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

        &__timestamp {
            flex-shrink: 0;
            opacity: 0.5;
            font-size: 0.9em;
        }
    }
}
</style>
