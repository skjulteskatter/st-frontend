<template>
    <div class="flex flex-col h-screen relative">
        <div class="flex flex-col sm:flex-row h-full" v-if="user && initialized">
            <the-navbar></the-navbar>
            <main class="w-full flex flex-col relative">
                <div class="flex-1 overflow-y-scroll sm:overflow-y-auto">
                    <header class="py-2 px-8 bg-white border-b border-gray-300 hidden md:flex justify-end sticky top-0 z-20">
                        <notification-list />
                    </header>
                    <router-view v-if="$route.name != 'songs-sheet-music'" />
                </div>
                <div :class="{'hidden': !sheetMusicOptions?.show || sheetMusicOptions?.type == 'sheetmusic-pdf' || $route.name != 'song' }">
                    <open-sheet-music-display
                        v-if="sheetMusicOptions?.show && sheetMusicOptions?.type == 'sheetmusic'"
                        :options="sheetMusicOptions"
                        :relativeKey="user.settings?.defaultTransposition"
                    />
                    <div id="osmd-canvas" class="bg-white"></div>
                </div>
                <audio-player></audio-player>
            </main>
            <!-- <feedback-form></feedback-form> -->
        </div>
        <!-- <loader :loading="!(user && initialized)" position="global"></loader> -->
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { useStore } from "@/store";
import themes from "@/classes/themes";
import TheNavbar from "@/components/TheNavbar.vue";
import { AudioPlayer } from "@/components/media";
import { appSession } from "@/services/session";
import { Loader } from "@/components";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import { ref } from "@vue/runtime-core";
import { NotificationList } from "@/components/notification";
import { notify } from "@/services/notify";
import { cache } from "@/services/cache";

@Options({
    components: {
        TheNavbar,
        AudioPlayer,
        Loader,
        OpenSheetMusicDisplay,
        NotificationList,
    },
    name: "dashboard-layout",
})
export default class DashboardLayout extends Vue {
    public store = useStore();

    public get initialized() {
        return ref(appSession.initialized).value;
    }

    async mounted() {
        document.documentElement.style.setProperty(
            "--st-color-primary",
            themes.default,
        );
        themes.load();

        const route = this.$route.name;
        setTimeout(() => {
            if (this.initialized == false && this.$route.name == route) {
                notify("error", "Something is wrong", "exclamation", "Click here to reload", 30000, () => cache.clearCache());
            }
        }, 5000);

        if (!this.user) {
            this.$router.push({ name: "login" });
        } else {
            await appSession.init();
        }
    }

    public get sheetMusicOptions() {
        return this.store.state.songs.sheetMusic;
    }

    public get user() {
        return this.store.getters.user;
    }

    // public get isAdmin() {
    //     return this.store.getters..isAdmin;
    // }
}
</script>
