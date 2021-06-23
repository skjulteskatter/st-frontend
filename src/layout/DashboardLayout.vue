<template>
    <div class="flex flex-col h-screen relative">
        <div class="flex flex-col sm:flex-row h-full" v-if="user && initialized">
            <the-navbar></the-navbar>
            <main class="w-full flex flex-col relative h-full">
                <div class="flex-1 overflow-y-auto h-full" style="overflow-y: overlay">
                    <header class="py-2 px-8 bg-white border-b border-gray-300 hidden md:flex justify-between items-center gap-4 sticky top-0 z-20 dark:bg-secondary dark:border-none">
                        <back-button v-if="$route.name != 'main'" />
                        <div class="flex gap-4 items-center ml-auto">
                            <store-cart />
                            <notification-list />
                            <icon name="settings" class="cursor-pointer" @click="$router.push('/settings')" />
                        </div>
                    </header>
                    <router-view />
                    <copyright />
                </div>
                <div
                    class="sticky bottom-0 md:overflow-y-auto"
                    :class="{'hidden': !sheetMusicOptions?.show || sheetMusicOptions?.type == 'sheetmusic-pdf' || $route.name != 'song' }"
                >
                    <open-sheet-music-display
                        v-if="sheetMusicOptions?.show && ['sheetmusic-musicxml', 'sheetmusic'].includes(sheetMusicOptions.type ?? '')"
                        :options="sheetMusicOptions"
                        :relativeKey="user.settings?.defaultTransposition"
                        @startLoading="osmdLoading = true"
                        @finishLoading="osmdLoading = false"
                    />
                    <div id="osmd-canvas" class="bg-white"></div>
                    <loader :loading="osmdLoading" />
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
                <audio-player />
            </main>
            <privacy-policy-accept />
            <added-to-cart />
            <tos></tos>
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
import { Copyright } from "@/components";
import PrivacyPolicyAccept from "@/components/PrivacyPolicyAccept.vue";
import AddedToCart from "@/components/store/AddedToCart.vue";
import TOSAccept from "@/components/TOSAccept.vue";
import { StripeActionTypes } from "@/store/modules/stripe/action-types";

@Options({
    components: {
        TheNavbar,
        AudioPlayer,
        OpenSheetMusicDisplay,
        NotificationList,
        StoreCart,
        PrivacyPolicyAccept,
        tos: TOSAccept,
        Copyright,
        AddedToCart,
    },
    name: "dashboard-layout",
})
export default class DashboardLayout extends Vue {
    public store = useStore();
    public osmdLoading = false;

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
                notify("error", "Something is wrong", "exclamation", "Click here to reload", 30000, () => cache.clearCache(), false);
            }
        }, 5000);

        if (!this.user) {
            this.$router.push({ name: "login" });
        } else {
            if (!this.store.getters.stripeInitialized) {
                await this.store.dispatch(
                    StripeActionTypes.SETUP,
                );
            }
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
