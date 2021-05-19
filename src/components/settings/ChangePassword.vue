<template>
	<modal :label="$t('settings.changePassword')" theme="tertiary" class="change-password">
		<h3 class="change-password__title">{{ $t("settings.changePassword") }}</h3>
		<form @submit="resetPassword" class="change-password__form">
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
			<button formaction="submit">{{ $t("common.submit") }}</button>
		</form>
	</modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Modal } from "@/components";
import { useStore } from "vuex";
import auth from "@/services/auth";
import { BaseInput } from "@/components/inputs";

@Options({
	name: "change-password",
	components: {
		Modal,
		BaseInput,
	},
})
export default class ChangePassword extends Vue {
	private store = useStore();

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
}
</script>

<style lang="scss">
.change-password {
	flex-shrink: 0;

	&__title {
		margin-top: 0;
	}
	&__form {
		min-width: 300px;
		display: flex;
		flex-direction: column;
		gap: var(--st-spacing);
	}
}
</style>
