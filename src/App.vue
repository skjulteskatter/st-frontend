<template>
    <div id="songtreasures">
        <div class="loader" v-if="!initialized"></div>
        <router-view v-else />
        <notification-group />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { NotificationGroup } from "@/components/notification";
import { useStore } from "./store/typed";
import { SessionMutationTypes } from "./store/typed/modules/session/mutation-types";

@Options({
    components: {
        NotificationGroup,
    },
    name: "app",
})
export default class App extends Vue {
    public store = useStore();

    public mounted() {
        if (window.location.pathname.startsWith("/store/")) {
            this.store.commit(SessionMutationTypes.REDIRECT, window.location.pathname);
        }
    }

    public get initialized() {
        return useStore().getters.initialized;
    }
}
</script>

<style lang="scss">
@import "@/style/main";

body {
    --st-color-background-dark: var(--st-color-ui-lm-medium);
    --st-color-background-medium: var(--st-color-ui-lm-light);
    --st-color-background-light: white;
    --st-color-border: var(--st-color-ui-lm-dark);
    --st-color-text: var(--st-color-text-lm);

    background-color: var(--st-color-background-dark);
    color: var(--st-color-text);

    &.darkmode {
        --st-color-background-dark: var(--st-color-ui-dm-dark);
        --st-color-background-medium: var(--st-color-ui-dm-medium);
        --st-color-background-light: var(--st-color-ui-dm-light);
        --st-color-border: var(--st-color-ui-dm-light);
        --st-color-text: var(--st-color-text-dm);
    }
}
</style>
