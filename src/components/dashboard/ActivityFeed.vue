<template>
    <base-card class="activity-feed">
        <h3 class="activity-feed__title">
            {{ $t("common.activity") }}
        </h3>
        <div v-if="activitiesInitialized">
            <div class="activity-feed__activities" v-if="activities.length">
                <router-link
                    class="activity-feed__activity"
                    v-for="(a, i) in activities"
                    :key="a.id ?? i"
                    :to="{
                        name: a.type == 'song' ? 'song' : 'contributor',
                        params: a.type == 'song' ? {
                            collection: collections.find(c => c.id == getSongItem(a).collectionId)?.id,
                            number: getSongItem(a).number,
                        } : {
                            contributor: a.itemId,
                        },
                    }"
                >
                    {{ a.type == 'song' ? getSongItem(a)?.getName(languageKey) : a.item?.name }}
                    <span class="activity-feed__activity__timestamp">
                        {{ timeSince(a.loggedDate) }}
                    </span>
                </router-link>
            </div>
            <p class="activity-feed__fallback" v-else>
                {{ $t("dashboard.noactivity") }}
            </p>
        </div>
        <div v-else class="loader"></div>
    </base-card>
    <base-card class="activity-feed">
        <h3 class="activity-feed__title">
            {{ $t("activity.recentlyOpened") }}
        </h3>
        <div class="activity-feed__collections">
            <collection-card
                class="activity-feed__collection"
                v-for="c in recentCollections"
                :key="c.id"
                :collection="c"
            />
        </div>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Contributor, Song } from "@/classes";
import { useStore } from "@/store";

import { 
    BaseCard, 
    CollectionCard,
} from "@/components";
import { ApiActivity, ApiSong } from "dmb-api";

@Options({
    name: "activity-feed",
    components: {
        BaseCard,
        CollectionCard,
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

    public getSongItem(activity: ApiActivity) {
        return activity.item as Song;
    }
    
    public getContributor(activity: ApiActivity) {
        return activity.item as Contributor;
    }

    public get languageKey() {
        return this.store.getters.languageKey;
    }

    public get collections() {
        return this.store.getters.collections;
    }

    public get activitiesInitialized() {
        return this.store.state.session.activities != undefined;
    }

    public get activities() {
        return this.store.getters.activities;
    }

    public get recentCollections() {
        return this.collections.filter(c => this.activities.filter(a => a.type == "song").map(a => (a.item as ApiSong).collectionId).includes(c.id));
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

        &__timestamp {
            flex-shrink: 0;
            opacity: 0.5;
            font-size: 0.9em;
        }
    }

    &__collections {
        display: flex;
        gap: var(--st-spacing);
    }

    &__collection {
        display: flex;
    }
}
</style>
