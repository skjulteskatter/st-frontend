<template>
	<base-modal :show="show">
		<template #title>
			<h2 class="font-bold">{{ $t('playlist_createnew') }}</h2>
		</template>
		<form @submit.prevent="createPlaylist" class="flex flex-col gap-4">
			<base-input
				class="border border-black/20 dark:border-white/20 flex-shrink-0"
				:label="$t('common_name')"
				v-model="playlistName"
				required
			/>
			<base-button :loading="loading" theme="secondary" type="submit">
				<template #icon>
					<CheckIcon class="w-4 h-4" />
				</template>
				Ok
			</base-button>
		</form>
	</base-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { BaseModal, BaseButton } from "@/components";
import { BaseInput } from "@/components/inputs";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { notify } from "@/services/notify";
import { CheckIcon } from "@heroicons/vue/solid";

@Options({
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
})
export default class CreatePlaylistModal extends Vue {
	private store = useStore();
	public show?: boolean;
    
	public playlistName = "";
	public loading = false;

    public async createPlaylist() {
		this.loading = true;
        await this.store.dispatch(SessionActionTypes.PLAYLIST_CREATE, {
            name: this.playlistName,
        });

        notify("success", this.$t("playlist_newplaylist"), "check", `${this.$t("playlist_newplaylist")} "${this.playlistName}"`, undefined, undefined, false);

        this.playlistName = "";
		this.loading = false;
		this.$emit("close");
    }
}
</script>
