<template>
    <div class="dashboard-layout">
        <div class="dashboard-layout__wrapper">
            <the-navbar v-if="user"></the-navbar>
            <main v-if="user" class="dashboard-layout__body">
                <div class="dashboard-layout__body__container">
                    <router-view />
                </div>
            </main>
        </div>
        <audio-player></audio-player>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "../store";
import themes from "@/classes/themes";
import TheNavbar from "@/components/TheNavbar.vue";
import { AudioPlayer } from "@/components/media";

@Options({
    components: {
        TheNavbar,
        AudioPlayer,
    },
})
export default class DashboardLayout extends Vue {
    mounted() {
        document.documentElement.style.setProperty(
            "--st-primary-color",
            localStorage.getItem("theme_color") || themes.default
        );
        themes.load();
        if (this.initialized && !this.user) {
            this.$router.push({ name: "login" });
        }
    }

    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
    public get isAdmin() {
        return useStore(sessionKey).getters.isAdmin;
    }
    public get initialized() {
        return useStore(sessionKey).state.initialized;
    }
}
</script>
<style lang="scss">
.dashboard-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;

    &__wrapper {
        display: flex;
        overflow-y: auto;
        height: 100%;
    }

    &__body {
        width: 100%;
        display: flex;
        flex-direction: column;

        &__container {
            flex-grow: 1;
            overflow-y: auto;
        }
    }
}
</style>