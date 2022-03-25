<template>
    <SplashScreen :loading="ready === false" />
    <Loader :loading="ready === false">
        <router-view />
    </Loader>
    <NotificationGroup />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { NotificationGroup } from "@/components/notification";
import SplashScreen from "@/components/SplashScreen.vue";
import { appSession } from "./services/session";

export default defineComponent({
    name: "app",
    components: {
        NotificationGroup,
        SplashScreen,
    },
    data: () => ({
        ready: false,
    }),
    mounted() {
        appSession.onReady(() => {
            this.ready = true;
        });
        if (!window.location.pathname.startsWith("/login")) {
            this.store.commit(
                SessionMutationTypes.REDIRECT,
                window.location.pathname,
            );
        }
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
