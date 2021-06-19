<template>
	<base-modal
		ref="create-playlist-modal"
		:show="show"
	>
		<form @submit.prevent="createPlaylist" class="flex flex-col gap-2">
			<base-input
				class="border border-gray-300"
				:label="$t('common.name')"
				v-model="playlistName"
				required
			/>
			<base-button :disabled="disabled" :loading="loading" theme="secondary" type="submit">
				{{ $t("playlist.createnew") }}
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
	},
})
export default class CreatePlaylistModal extends Vue {
	private store = useStore();
	public show?: boolean;
    
	public playlistName = "";
	public loading = false;
	public disabled = false;

    public async createPlaylist() {
		this.loading = true;
        await this.store.dispatch(SessionActionTypes.PLAYLIST_CREATE, {
            name: this.playlistName,
        });

        notify("success", this.$t("playlist.newplaylist"), "check", `${this.$t("playlist.newplaylist")} "${this.playlistName}"`);

        this.playlistName = "";
		this.loading = false;
		// this.disabled = true;
		// (this.$refs["create-playlist-modal"] as Modal).closeModal();
		this.$emit("close");
    }
}
</script>
