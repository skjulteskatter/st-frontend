<template>
	<Loader :loading="!(initialized && user)">
		<div class="flex flex-col h-full">
			<TheNavbar />
			<main class="flex-grow">
				<div class="h-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
					<!-- Route transitions -->
					<router-view v-slot="{ Component }">
						<transition
							mode="out-in"
							enter-active-class="transition duration-100 ease-out"
							enter-from-class="opacity-0 -translate-x-1"
							enter-to-class="opacity-100 translate-x-0"
							leave-active-class="transition duration-50 ease-in"
							leave-from-class="opacity-100 translate-x-0"
							leave-to-class="opacity-0 translate-x-1"
						>
							<component :is="Component"/>
						</transition>
					</router-view>
				</div>
				<!-- OSMD -->
				<OpenSheetMusicDisplay
					v-if="sheetMusicOptions?.show && ['sheetmusic-musicxml', 'sheetmusic'].includes(sheetMusicOptions.type ?? '')"
					:options="sheetMusicOptions"
					:relativeKey="user?.settings?.defaultTransposition"
					@startLoading="osmdLoading = true"
					@finishLoading="osmdLoading = false"
				/>
				<Loader :loading="osmdLoading" />
				<div
					class="w-full h-full flex flex-col fixed top-20"
					:class="{'hidden': !sheetMusicOptions?.show || sheetMusicOptions?.type != 'sheetmusic-pdf' }"
				>
					<div class="p-4 flex justify-end bg-white w-full">
						<BaseButton theme="error" @click="close()">
							<template #icon>
								<XIcon class="w-4 h-4" />
							</template>
							{{$t('common_close')}}
						</BaseButton>
					</div>
					<object :key="sheetMusicOptions?.url" :data="sheetMusicOptions?.url + '\#toolbar=0'" type="application/pdf" class="flex-grow">PDF cannot be displayed.</object>
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
	</Loader>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";

import { useStore } from "@/store";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
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
		store: useStore(),
		osmdLoading: false,
		show: false,
	}),
	computed: {
		initialized() {
			return ref(appSession.initialized).value;
		},
		sheetMusicOptions() {
			return this.store.state.songs.sheetMusic;
		},
		user() {
			return this.store.getters.user;
		},
		splash: {
			get() {
				return this.store.state.session.splash;
			},
			set(v: {
				title: string;
				content: string;
				callback?: () => Promise<void>;
			}) {
				this.store.commit(SessionMutationTypes.SPLASH, v);
			},
		},
	},
	async mounted() {
		themes.load();
        const route = this.$route.name;
        setTimeout(() => {
            if (this.initialized == false && this.$route.name == route) {
                notify("error", "Something is wrong", "exclamation", "Click here to reload", 30000, () => cache.clearCache(), false);
            }
        }, 5000);

        if (!this.user) {
            this.$router.push({ name: "login-view" });
        } else {
            await appSession.init();
        }
    },
	methods: {
		close() {
			if(this.sheetMusicOptions) {
				this.sheetMusicOptions.show = false;
			}
		},
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
