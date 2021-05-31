<template>
    <splash-screen :loading="initialized === false" />
    <loader :loading="initialized === false">
        <router-view />
    </loader>
    <notification-group />
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { NotificationGroup } from "@/components/notification";
import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import SplashScreen from "@/components/SplashScreen.vue";

@Options({
    components: {
        NotificationGroup,
        SplashScreen,
    },
    name: "app",
})
export default class App extends Vue {
    public store = useStore();

    public mounted() {
        if (window.location.pathname.startsWith("/store/") || window.location.pathname.startsWith("/collections/")) {
            this.store.commit(
                SessionMutationTypes.REDIRECT,
                window.location.pathname,
            );
        }
    }

    public get initialized() {
        return useStore().getters.initialized;
    }
}
</script>

<style lang="scss">
@import "@/style/main";

#app {
    height: 100vh;
}

body {
    --st-color-background-dark: var(--st-color-ui-lm-medium);
    --st-color-background-medium: var(--st-color-ui-lm-light);
    --st-color-background-light: white;
    --st-color-border: var(--st-color-ui-lm-dark);
    --st-color-text: var(--st-color-text-lm);
    --st-color-text-inverted: var(--st-color-text-dm);

    background-color: var(--st-color-background-dark);
    color: var(--st-color-text);

    &.dark {
        --st-color-secondary: #ffffff;
        --st-color-background-dark: var(--st-color-ui-dm-dark);
        --st-color-background-medium: var(--st-color-ui-dm-medium);
        --st-color-background-light: var(--st-color-ui-dm-light);
        --st-color-border: var(--st-color-ui-dm-light);
        --st-color-text: var(--st-color-text-dm);
        --st-color-text-inverted: var(--st-color-text-lm);

        .button-secondary {
            color: var(--st-color-text-lm);
        }
    }
}
</style>
