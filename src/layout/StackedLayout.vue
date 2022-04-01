<template>
	<div class="flex flex-col h-full">
		<TheNavbar />
		<main class="flex-grow">
			<div class="h-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" v-if="loaded">
				<!-- Route transitions -->
				<router-view v-slot="{ Component }">
					<!-- <transition
						mode="out-in"
						enter-active-class="transition duration-100 ease-out"
						enter-from-class="opacity-0 -translate-x-1"
						enter-to-class="opacity-100 translate-x-0"
						leave-active-class="transition duration-50 ease-in"
						leave-from-class="opacity-100 translate-x-0"
						leave-to-class="opacity-0 translate-x-1"
					> -->
						<component :is="Component"/>
					<!-- </transition> -->
				</router-view>
			</div>
		</main>
		<footer>
			<Copyright />
		</footer>
		<AudioPlayer />
	</div>

	<!-- Modals -->
	<PrivacyPolicyAccept />
	<CompleteRegistration />
	<AddedToCart />
	<Tos />
	<BaseModal
		:show="show && splash != undefined"
		@close="closeSplash()"
	>
		<template #title>
			<h3 class="text-lg font-bold">{{splash?.title}}</h3>
		</template>
		<p>{{splash?.content}}</p>
		<template #footer>
			<div v-if="splash?.callback" class="flex gap-2">
				<BaseButton theme="tertiary" @click="closeSplash()">{{$t('common_cancel')}}</BaseButton>
				<BaseButton class="ml-auto" @click="splash?.callback ? splash.callback() : undefined">{{$t('continue')}}</BaseButton>
			</div>
			<BaseButton v-else class="ml-auto" @click="closeSplash()">{{$t('common_close')}}</BaseButton>
		</template>
	</BaseModal>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import { appSession } from "@/services/session";

import TheNavbar from "@/components/TheNavbar.vue";
import { Copyright, BaseModal } from "@/components";
import { AudioPlayer } from "@/components/media";
import OpenSheetMusicDisplay from "@/components/OSMD.vue";
import Tos from "@/components/TOSAccept.vue";
import PrivacyPolicyAccept from "@/components/PrivacyPolicyAccept.vue";
import AddedToCart from "@/components/store/AddedToCart.vue";
import themes from "@/classes/themes";
import { notify } from "@/services/notify";
import { cache } from "@/services/cache";
import { XIcon } from "@heroicons/vue/solid";
import CompleteRegistration from "@/components/CompleteRegistration.vue";
import { reactive } from "vue";
import { ensureLanguageIsFetched } from "@/i18n";

export default defineComponent({
	name: "stacked-layout",
	components: {
    TheNavbar,
    Copyright,
    BaseModal,
    AudioPlayer,
    OpenSheetMusicDisplay,
    Tos,
    PrivacyPolicyAccept,
    AddedToCart,
    XIcon,
    CompleteRegistration,
},
	data: () => ({
		osmdLoading: false,
		show: false,
		splash: undefined,
		loaded: false,
	}),
	computed: {
		session() {
			return reactive(appSession);
		},
		user() {
			return this.session.User;
		},
	},
	async mounted() {
		themes.load();
        const route = this.$route.name;
        setTimeout(() => {
            if (this.session.initialized == false && this.$route.name == route) {
                notify("error", "Something is wrong", "exclamation", "Click here to reload", 30000, () => cache.clearCache(), false);
            }
        }, 5000);

        if (!this.user) {
            this.$router.push({ name: "login-view" });
        } else {
            await appSession.init();
			await ensureLanguageIsFetched();
			this.loaded = true;
        }
    },
	methods: {
		closeSplash() {
			this.show = false;
			setTimeout(() => {
				this.splash = undefined;
				this.show = true;
			}, 500);
		},
	},
});
</script>
