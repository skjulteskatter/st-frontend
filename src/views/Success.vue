<template>
    <div class="h-full flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold text-center">Thank you for your purchase!</h1>
        <p class="text-center">Your product should be available soon.</p>
        <div class="mt-8 text-center">
            <p class="text-gray-500 text-sm uppercase tracking-widest">Download the app</p>
            <div class="p-4 flex gap-4">
                <a class="flex flex-col items-center" href="https://apps.apple.com/us/app/songtreasures/id1567166808?itsct=apps_box_link&itscg=30200">
                    <img src="img/app_store_badge.png" alt="App Store" class="max-h-12" height="48">
                </a>
                <a class="flex flex-col items-center" href='https://play.google.com/store/apps/details?id=no.sssf.songtreasures&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                    <img alt='Get it on Google Play' class="max-h-12" src='img/play_store_badge.png' height="48"/>
                </a>
            </div>
        </div>
        <router-link
            to="/collections"
            class="text-primary mt-4 hover:underline"
        >
            Go to collections
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";

export default defineComponent({
    name: "success",
    data: () => ({
        store: useStore(),
        selectedLanguage: {} as Language,
        languageSet: false,
    }),
    computed: {
        user() {
            return this.store.getters.user;
        },
        languages(): Language[] {
            return appSession.languages || [];
        },
    },
    mounted() {
        this.selectedLanguage =
            this.languages.find(
                (l) => l.key == this.user?.settings?.languageKey,
            ) ??
            this.languages.find((l) => l.key == "no") ??
            ({} as Language);
    },
    methods: {
        async save() {
            await this.store.dispatch(SessionActionTypes.SESSION_SAVE_SETTINGS);
        },
        setLanguage() {
            const settings = Object.assign({}, this.user?.settings);
            const language = this.selectedLanguage;
            if (language) {
                settings.languageKey = language.key;
                this.store.commit(SessionMutationTypes.SET_SETTINGS, settings);
                this.save();
            }
            this.languageSet = true;
        },
    },
});
</script>
