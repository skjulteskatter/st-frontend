<template>
	<loader :loading="!(user && initialized)">
		<the-navbar />
		<main>
			<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<router-view />
				<copyright class="mt-8" />
			</div>

			<!-- OSMD -->
			<div
				class="sticky bottom-0 md:overflow-y-auto"
				:class="{'hidden': !sheetMusicOptions?.show || sheetMusicOptions?.type == 'sheetmusic-pdf' || $route.name != 'song' }"
			>
				<open-sheet-music-display
					v-if="sheetMusicOptions?.show && ['sheetmusic-musicxml', 'sheetmusic'].includes(sheetMusicOptions.type ?? '')"
					:options="sheetMusicOptions"
					:relativeKey="user?.settings?.defaultTransposition"
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

		<!-- Modals -->
		<privacy-policy-accept />
		<added-to-cart />
		<tos />
		<base-modal
			:show="show && splash != undefined"
			@close="closeSplash()"
		>
			<h3 class="text-lg uppercase">{{splash?.title}}</h3>
			<hr/>
			<p class="mt-2">{{splash?.content}}</p>
			<br/>
			<div v-if="splash?.callback" class="flex">
				<base-button theme="tertiary" @click="closeSplash()">{{$t('cancel')}}</base-button>
				<base-button class="ml-auto" @click="splash?.callback ? splash.callback() : undefined">{{$t('continue')}}</base-button>
			</div>
			<base-button v-else class="ml-auto" @click="closeSplash()">{{$t('common.close')}}</base-button>
		</base-modal>
	</loader>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
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
import { StripeActionTypes } from "@/store/modules/stripe/action-types";
import { cache } from "@/services/cache";

@Options({
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
	},
})
export default class StackedLayout extends Vue {
	public store = useStore();
    public osmdLoading = false;
    public show = true;

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

    public closeSplash() {
        this.show = false;

        setTimeout(() => {
            this.splash = undefined;
            this.show = true;
        }, 500);
    }

    public get sheetMusicOptions() {
        return this.store.state.songs.sheetMusic;
    }

    public get user() {
        return this.store.getters.user;
    }

    public set splash(v) {
        this.store.commit(SessionMutationTypes.SPLASH, v);
    }

    public get splash() {
        return this.store.state.session.splash;
    }
}
</script>