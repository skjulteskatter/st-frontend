<template>
    <div>
        <router-view />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import DashboardLayout from "@/layout/DashboardLayout.vue";

@Options({
    components: {
        DashboardLayout,
    },
})
export default class App extends Vue {
    public onLyrics = false;

    public mounted() {
        this.onLyrics = this.$route.name == "lyrics";
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
