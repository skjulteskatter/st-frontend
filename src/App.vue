<template>
    <div>
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

#app {
    font-family: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--st-text-color);
}
</style>
