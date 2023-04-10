<template>
	<BaseModal :show="show">
		<template #title>
			<h2 class="font-bold">{{ $t('playlist_createnew') }}</h2>
		</template>
		<form @submit.prevent="createPlaylist" class="flex flex-col gap-4">
			<BaseInput
				class="border border-black/20 dark:border-white/20 flex-shrink-0"
				:label="$t('common_name')"
				v-model="playlistName"
				required
			/>
			<div class="grid grid-cols-2 gap-2">
				<BaseButton theme="neutral" @click="$emit('close')">
					{{ $t("common_cancel") }}
				</BaseButton>
				<BaseButton :loading="loading" theme="secondary" type="submit">
					<template #icon>
						<CheckIcon class="w-4 h-4" />
					</template>
					Ok
				</BaseButton>
			</div>
		</form>
	</BaseModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { BaseModal, BaseButton } from "@/components";
import { BaseInput } from "@/components/inputs";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { notify } from "@/services/notify";
import { CheckIcon } from "@heroicons/vue/solid";

export default defineComponent({
	name: "create-playlist-modal",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		BaseModal,
		BaseButton,
		BaseInput,
		CheckIcon,
	},
	data: () => ({
		store: useStore(),
		playlistName: "",
		loading: false,
	}),
	methods: {
		async createPlaylist() {
			this.loading = true;
			await this.store.dispatch(SessionActionTypes.PLAYLIST_CREATE, {
				name: this.playlistName,
			});

			notify("success", this.$t("playlist_newplaylist"), "check", `${this.$t("playlist_newplaylist")} "${this.playlistName}"`, undefined, undefined, false);

			this.playlistName = "";
			this.loading = false;
			this.$emit("close");
		},
	},
});
</script>
