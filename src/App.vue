<template>
    <SplashScreen :loading="ready === false" />
    <Loader :loading="ready === false">
        <div class="max-w-screen-2xl mx-auto px-4 pt-4">
            <BandSyncOutOfSyncBar />
        </div>
        <router-view />
    </Loader>
    <NotificationGroup />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NotificationGroup } from "@/components/notification";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { BandSyncActionTypes } from "@/store/modules/bandSync/action-types";
import SplashScreen from "@/components/SplashScreen.vue";
import BandSyncOutOfSyncBar from "@/components/bandSync/BandSyncOutOfSyncBar.vue";
import {
    createBandSyncSongCoordinator,
    BandSyncSongCoordinator,
} from "@/composables/useBandSyncSongCoordinator";
import { registerBandSyncCoordinator } from "@/services/bandSync/bandSyncCoordinatorRegistry";
import { appSession } from "./services/session";

export default defineComponent({
    name: "app",
    components: {
        NotificationGroup,
        SplashScreen,
        BandSyncOutOfSyncBar,
    },
    data: () => ({
        store: useStore(),
        ready: false,
        bandSyncCoordinator: null as BandSyncSongCoordinator | null,
    }),
    mounted() {
        this.bandSyncCoordinator = createBandSyncSongCoordinator(
            this.store,
            this.$router,
        );
        this.bandSyncCoordinator.start();
        registerBandSyncCoordinator(this.bandSyncCoordinator);

        appSession.onReady(() => {
            this.store.dispatch(BandSyncActionTypes.INIT);
            this.ready = true;
        });
        if (!window.location.pathname.startsWith("/login")) {
            this.store.commit(
                SessionMutationTypes.REDIRECT,
                window.location.pathname,
            );
        }
    },
    unmounted() {
        this.bandSyncCoordinator?.dispose();
        registerBandSyncCoordinator(null);
        this.bandSyncCoordinator = null;
    },
});
</script>

<style lang="scss">
#app {
    height: 100vh;
}

html {
    --st-color-background-dark: var(--st-color-ui-lm-medium);
    --st-color-background-medium: var(--st-color-ui-lm-light);
    --st-color-background-light: white;
    --st-color-border: var(--st-color-ui-lm-dark);
    --st-color-text: var(--st-color-text-lm);
    --st-color-text-inverted: var(--st-color-text-dm);

    background-color: var(--st-color-background-dark);
    color: var(--st-color-text);
    overflow-y: scroll;
    
    scroll-behavior: smooth;

    &.dark {
        --st-color-secondary: #ffffff;
        --st-color-background-dark: var(--st-color-ui-dm-dark);
        --st-color-background-medium: var(--st-color-ui-dm-medium);
        --st-color-background-light: var(--st-color-ui-dm-light);
        --st-color-border: var(--st-color-ui-dm-light);
        --st-color-text: var(--st-color-text-dm);
        --st-color-text-inverted: var(--st-color-text-lm);

        .button--secondary {
            color: var(--st-color-text-lm);
        }
    }
}
</style>
