<template>
    <div class="flex flex-col h-screen relative">
        <div class="flex flex-col sm:flex-row h-full" v-if="user && initialized">
            <the-navbar></the-navbar>
            <main class="w-full flex flex-col relative">
                <div class="flex-1 overflow-y-scroll sm:overflow-y-auto">
                    <router-view v-if="$route.name != 'songs-sheet-music'" />
                </div>
                <div :class="{'hidden': !sheetMusicOptions?.show || sheetMusicOptions?.type != 'sheetmusic-pdf' || $route.name != 'song' }">
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
import { FeedbackForm } from "@/components/feedback";
import { appSession } from "@/services/session";
import { Loader } from "@/components";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";

@Options({
    components: {
        TheNavbar,
        AudioPlayer,
        FeedbackForm,
        Loader,
        OpenSheetMusicDisplay,
    },
    name: "dashboard-layout",
})
export default class DashboardLayout extends Vue {
    public store = useStore();

    public get initialized() {
        return appSession.initialized;
    }

    async mounted() {
        document.documentElement.style.setProperty(
            "--st-color-primary",
            themes.default,
        );
        themes.load();
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
