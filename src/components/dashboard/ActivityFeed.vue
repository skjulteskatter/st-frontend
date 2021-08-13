<template>
    <base-card>
        <template #header>
            <div class="flex items-center">
                <h2 class="font-bold mr-4">
                    {{ $t("common.activity") }}
                </h2>
                <tooltip :text="$t('tooltip.recentActivity')" />
            </div>
        </template>
        <loader :loading="activitiesInitialized === false">
            <div class="flex flex-col gap-2 relative" v-if="activities.length">
                <router-link
                    class="flex p-2 text-xs relative rounded-md hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring focus:ring-primary ring-offset-2"
                    v-for="(a, i) in activities"
                    :key="a.id ?? i"
                    :to="a.getRouterLink(collections)"
                >
                    <img
                        alt="Activity thumbnail"
                        :src="a.getImage(collections)"
                        class="mr-2 max-h-10 grayscale rounded"
                    />
                    <span class="flex flex-col justify-center flex-1">
                        <small class="opacity-50 tracking-wide">{{ $t(`song.${a.type}`) }}</small>
                        <strong>
                            {{ a.name }}
                        </strong>
                    </span>
                    <small class="opacity-50 absolute top-2 right-2">
                        {{ a.timeSince() }}
                    </small>
                </router-link>
            </div>
            <p class="p-4 text-gray-500 dark:text-gray-400 text-center" v-else>
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
