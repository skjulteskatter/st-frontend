<template>
	<button @click="showModal" class="text-sm px-3 py-2 rounded-md bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20">
		<KeyIcon class="inline w-4 h-4 mr-2" />
		<span>{{ $t('settings_changePassword') }}</span>
	</button>
	<BaseModal
		:show="show"
		@close="hideModal"
		class="change-password"
	>
		<template #title>
			<h3 class="font-bold text-xl">{{ $t("settings_changePassword") }}</h3>
		</template>
		<form @submit="resetPassword" class="flex flex-col gap-2">
			<BaseInput
				type="password"
				v-if="passwordUser"
				v-model="oldPassword"
				:label="$t('settings_oldPassword')"
			/>
			<BaseInput
				type="password"
				v-model="newPassword"
				:label="$t('settings_newPassword')"
			/>
			<BaseInput
				type="password"
				v-model="repeatPassword"
				:label="$t('settings_repeatPassword')"
				:class="{'text-red-500 border-red-500': newPassword != repeatPassword}"
			/>
			<BaseButton theme="secondary" formaction="submit">
				<template #icon>
					<CheckIcon class="w-4 h-4" />
				</template>
				{{ $t("common_submit") }}
			</BaseButton>
		</form>
	</BaseModal>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import auth from "@/services/auth";
import { BaseModal } from "@/components";
import { BaseInput } from "@/components/inputs";
import { KeyIcon, CheckIcon } from "@heroicons/vue/solid";

export default defineComponent({
	name: "change-password",
	components: {
		BaseModal,
		BaseInput,
		KeyIcon,
		CheckIcon,
	},
	data: () => ({
		show: false,
		newPassword: "",
		repeatPassword: "",
		oldPassword: "",
	}),
	computed: {
		passwordUser() {
			return auth.user?.providerData.find((p) => p?.providerId == "password");
		},
	},
	methods: {
		resetPassword() {
			if (this.newPassword == this.repeatPassword) {
				auth.resetPassword(this.oldPassword, this.newPassword);
			}
		},
		showModal() {
			this.show = true;
		},
		hideModal() {
			this.show = false;
		},
	},
});
</script>
