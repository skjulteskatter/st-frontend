<template>
    <base-card>
        <h3 class="font-bold flex gap-2 items-center mb-4">
            {{ $t("common.activity") }}
            <tooltip text="Her ser du all din nylige aktivitet" />
        </h3>
        <loader :loading="activitiesInitialized === false">
            <div class="flex flex-col gap-2 relative" v-if="activities.length">
                <router-link
                    class="flex gap-2 p-2 text-xs relative rounded bg-white border hover:border-gray-400"
                    v-for="(a, i) in activities"
                    :key="a.id ?? i"
                    :to="a.getRouterLink(collections)"
                >
                    <img
                        :src="a.getImage(collections)"
                        class="max-h-10 grayscale rounded"
                    />
                    <span class="flex flex-col justify-center flex-1">
                        <small class="text-gray-400">{{ $t(`song.${a.type}`) }}</small>
                        <strong>
                            {{ a.getName(languageKey) }}
                        </strong>
                    </span>
                    <small class="opacity-50 absolute top-2 right-2">
                        {{ a.timeSince(languageKey) }}
                    </small>
                </router-link>
            </div>
            <p class="p-4 bg-gray-500 rounded text-center" v-else>
                {{ $t("dashboard.noactivity") }}
            </p>
        </loader>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";

import { BaseCard } from "@/components";
import { appSession } from "@/services/session";

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
        return appSession.collections;
    }

    public get activitiesInitialized() {
        return this.store.state.session.activities != undefined;
    }

    public get activities() {
        return this.store.getters.activities;
    }
}
</script>
