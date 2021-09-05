<template>
	<button @click="showModal" class="text-sm px-3 py-2 rounded-md bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20">
		<KeyIcon class="inline w-4 h-4 mr-2" />
		<span>{{ $t('settings.changePassword') }}</span>
	</button>
	<base-modal
		:show="show"
		@close="hideModal"
		class="change-password"
	>
		<template #title>
			<h3 class="font-bold text-xl">{{ $t("settings.changePassword") }}</h3>
		</template>
		<form @submit="resetPassword" class="flex flex-col gap-2">
			<base-input
				type="password"
				v-if="passwordUser"
				v-model="oldPassword"
				:label="$t('settings.oldPassword')"
			/>
			<base-input
				type="password"
				v-model="newPassword"
				:label="$t('settings.newPassword')"
			/>
			<base-input
				:style="newPassword != repeatPassword ? 'color: red' : ''"
				type="password"
				v-model="repeatPassword"
				:label="$t('settings.repeatPassword')"
			/>
			<base-button theme="secondary" formaction="submit">
				<template #icon>
					<CheckIcon class="w-4 h-4" />
				</template>
				{{ $t("common.submit") }}
			</base-button>
		</form>
	</base-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { BaseModal } from "@/components";
import { useStore } from "vuex";
import auth from "@/services/auth";
import { BaseInput } from "@/components/inputs";
import { KeyIcon, CheckIcon } from "@heroicons/vue/solid";

@Options({
	name: "change-password",
	components: {
		BaseModal,
		BaseInput,
		KeyIcon,
		CheckIcon,
	},
})
export default class ChangePassword extends Vue {
	private store = useStore();

	public show = false;
	public updatePassword = false;

    public newPassword = "";
    public repeatPassword = "";
    public oldPassword = "";

	public resetPassword() {
        if (this.newPassword == this.repeatPassword) {
            auth.resetPassword(this.oldPassword, this.newPassword);
        }
    }

    public get passwordUser() {
        return auth.user?.providerData.find((p) => p?.providerId == "password");
    }

	public showModal() {
		this.show = true;
	}

	public hideModal() {
		this.show = false;
	}
}
</script>
