<template>
	<modal
		theme="secondary"
		:label="$t('playlist.createnew')"
		icon="playlist"
	>
		<form @submit.prevent="createPlaylist" class="flex flex-col gap-2">
			<base-input
				class="border border-gray-300"
				:label="$t('common.name')"
				v-model="playlistName"
				required
			/>
			<base-button theme="secondary" type="submit">
				{{ $t("playlist.createnew") }}
			</base-button>
		</form>
	</modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { Modal, BaseButton } from "@/components";
import { BaseInput } from "@/components/inputs";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { notify } from "@/services/notify";

@Options({
	name: "create-playlist-modal",
	components: {
		Modal,
		BaseButton,
		BaseInput,
	},
})
export default class CreatePlaylistModal extends Vue {
	private store = useStore();
    public playlistName = "";

    public createPlaylist() {
        this.store.dispatch(SessionActionTypes.PLAYLIST_CREATE, {
            name: this.playlistName,
        });

        notify("success", this.$t("playlist.newplaylist"), "check", `${this.$t("playlist.newplaylist")} "${this.playlistName}"`);

        this.playlistName = "";
    }
}
</script>
