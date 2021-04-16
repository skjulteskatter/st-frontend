<template>
    <base-card class="activity-feed">
        <strong class="activity-feed__title">
            {{ $t("common.activity") }}
        </strong>
        <div class="activity-feed__activities" v-if="false">
            <small
                class="activity-feed__activity"
                v-for="(activity, i) in activities"
                :key="activity.id ?? i"
            >
                {{ activity.song?.getName(languageKey) }}
                <span class="activity-feed__activity__timestamp">
                    {{ timeSince(activity.loggedDate) }}
                </span>
            </small>
        </div>
        <p class="activity-feed__fallback" v-else>
            {{ $t("dashboard.noactivity") }}
        </p>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Song } from "@/classes";

import { BaseCard } from "@/components";
import { useStore } from "@/store/typed";

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
            style: "long",
        });
        const now = new Date().getTime();
        const then = new Date(date).getTime();
        const milliseconds = Math.floor(then - now);
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);

        const result = rtfl.format(minutes, "minutes");

        return result;
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
        margin-bottom: calc(var(--st-spacing) / 2);
    }

    &__activities {
        display: flex;
        flex-direction: column;
        gap: 0.5em;

        max-height: 20rem;
        overflow-y: hidden;
        position: relative;

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            background-image: linear-gradient(
                to bottom,
                transparent 90%,
                var(--st-color-background-medium)
            );
        }
    }

    &__activity {
        margin: 0;
        display: block;
        padding: 0.5em;
        border-radius: var(--st-border-radius);
        // border: 1px solid var(--st-color-border);
        background-color: var(--st-color-background-light);

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
