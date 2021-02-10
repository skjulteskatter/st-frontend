<template>
    <div class="dashboard-layout">
        <the-navbar v-if="user"></the-navbar>
        <main v-if="user" class="dashboard-layout__body">
            <router-view />
        </main>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { sessionKey } from "../store";
import themes from "@/classes/themes";
import TheNavbar from "@/components/TheNavbar.vue";

@Options({
    components: {
        TheNavbar,
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
    height: 100vh;

    &__body {
        overflow-y: auto;
        width: 100%;
    }
}
</style>