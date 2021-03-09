<template>
    <div id="songtreasures">
        <div class="loader" v-if="!initialized"></div>
        <router-view v-else />
        <notification-group />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "./store";
import DashboardLayout from "@/layout/DashboardLayout.vue";
import { NotificationGroup } from "@/components/notification";

@Options({
    components: {
        DashboardLayout,
        NotificationGroup,
    },
})
export default class App extends Vue {
    public onLyrics = false;

    public mounted() {
        this.onLyrics = this.$route.name == "lyrics";
    }

    public get initialized() {
        return useStore(sessionKey).state.initialized;
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
