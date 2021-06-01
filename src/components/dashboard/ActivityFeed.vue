<template>
    <base-card>
        <div class="flex gap-4 items-center mb-4">
            <h3 class="font-bold">
                {{ $t("common.activity") }}
            </h3>
            <tooltip text="Her ser du dine nylig åpnede sanger" />
        </div>
        <loader :loading="activitiesInitialized === false">
            <div class="flex flex-col gap-2 relative" v-if="activities.length">
                <router-link
                    class="flex gap-2 p-2 text-xs relative rounded bg-white border hover:border-gray-400 focus:outline-none focus:ring focus:ring-primary ring-offset-2"
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
            <p class="p-4 bg-gray-100 rounded text-center" v-else>
                {{ $t("dashboard.noactivity") }}
            </p>
        </loader>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "@/store";
import { appSession } from "@/services/session";

@Options({
    name: "activity-feed",
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
