<template>
    <BaseCard>
        <template #header>
            <div class="flex items-center">
                <h2 class="font-bold mr-4">
                    {{ $t("activity_recentlyViewed") }}
                </h2>
                <Tooltip :text="$t('tooltip_recentActivity')" />
            </div>
        </template>
        <Loader :loading="activitiesInitialized === false">
            <div class="flex flex-col gap-2 border-l-2 border-gray-100 dark:border-white/5 shadow-scroll" v-if="activities.length">
                <router-link
                    class="ml-2 flex p-2 text-xs relative rounded-md hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2"
                    v-for="(a, i) in activities"
                    :key="a.id ?? i"
                    :to="a.getRouterLink(collections)"
                >
                    <span class="w-2 h-2 bg-gray-200 rounded-full absolute -left-3 top-7 dark:bg-gray-500"></span>
                    <span class="flex flex-col justify-center flex-1">
                        <small class="opacity-50 tracking-wide">{{ $t(`common_${a.type}`) }}</small>
                        <p class="text-xs font-medium">
                            {{ a.name }}
                        </p>
                    </span>
                    <small class="opacity-50 absolute top-2 right-2">
                        {{ a.timeSince() }}
                    </small>
                </router-link>
            </div>
            <p class="p-4 text-gray-500 dark:text-gray-400 text-center" v-else>
                {{ $t("dashboard_noActivity") }}
            </p>
        </Loader>
    </BaseCard>
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

<style lang="scss">
@import "../../style/mixins";

.shadow-scroll {
    @include scrollShadow(white);
    max-height: 400px;
    overflow-y: auto;
}

.dark {
    .shadow-scroll {
        @include scrollShadow(#213F47);
    }
}
</style>
