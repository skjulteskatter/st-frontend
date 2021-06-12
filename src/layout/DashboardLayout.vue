<template>
    <div class="flex flex-col h-screen relative">
        <div class="flex flex-col sm:flex-row h-full" v-if="user && initialized">
            <the-navbar></the-navbar>
            <main class="w-full flex flex-col relative">
                <div class="flex-1 overflow-y-scroll sm:overflow-y-auto">
                    <header class="py-2 px-8 bg-white border-b border-gray-300 hidden md:flex justify-end items-center gap-4 sticky top-0 z-20 dark:bg-secondary dark:border-none">
                        <store-cart />
                        <notification-list />
                        <icon name="settings" class="cursor-pointer" @click="$router.push('/settings')" />
                    </header>
                    <router-view v-if="$route.name != 'songs-sheet-music'" />
                </div>
                <div
                    class="sticky bottom-0" 
                    :class="{'hidden': !sheetMusicOptions?.show || sheetMusicOptions?.type == 'sheetmusic-pdf' || $route.name != 'song' }"
                >
                    <open-sheet-music-display
                        v-if="sheetMusicOptions?.show && ['sheetmusic-musicxml', 'sheetmusic'].includes(sheetMusicOptions.type ?? '')"
                        :options="sheetMusicOptions"
                        :relativeKey="user.settings?.defaultTransposition"
                    />
                    <div id="osmd-canvas" class="bg-white"></div>
                </div>
                <div 
                    class="w-full h-full flex flex-col"
                    :class="{'hidden': !sheetMusicOptions?.show || sheetMusicOptions?.type != 'sheetmusic-pdf' }"
                >
                    <div class="p-4 flex justify-end bg-white w-full">
                        <base-button icon="error" theme="error" @click="close()">{{$t('common.close')}}</base-button>
                    </div>
                    <object :data="sheetMusicOptions?.url + '#toolbar=0'" type="application/pdf" class="flex-grow">PDF cannot be displayed.</object>
                </div>
                <audio-player></audio-player>
            </main>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

import { useStore } from "@/store";
import themes from "@/classes/themes";
import TheNavbar from "@/components/TheNavbar.vue";
import { AudioPlayer } from "@/components/media";
import { appSession } from "@/services/session";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import { ref } from "@vue/runtime-core";
import { NotificationList } from "@/components/notification";
import { StoreCart } from "@/components/store";
import { notify } from "@/services/notify";
import { cache } from "@/services/cache";

@Options({
    components: {
        TheNavbar,
        AudioPlayer,
        OpenSheetMusicDisplay,
        NotificationList,
        StoreCart,
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

    public close() {
        if(this.sheetMusicOptions) {
            this.sheetMusicOptions.show = false;
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
