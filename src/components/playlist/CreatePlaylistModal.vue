<template>
	<modal
		theme="primary"
		:label="$t('playlist.createnew')"
		icon="plus"
	>
		<form @submit.prevent="createPlaylist">
			<base-input
				:label="$t('common.name')"
				v-model="playlistName"
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
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

@Options({
	name: "create-playlist-modal",
	components: {
		Modal,
		BaseButton,
		BaseInput,
	}
})
export default class CreatePlaylistModal extends Vue {
	private store = useStore();
    public playlistName = "";

    public createPlaylist() {
        this.store.dispatch(SessionActionTypes.PLAYLIST_CREATE, {
            name: this.playlistName,
        });

        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            icon: "check",
            title: this.$t("playlist.newplaylist"),
            content: `${this.$t("playlist.newplaylist")} "${
                this.playlistName
            }"`,
        });

        this.playlistName = "";
    }
}
</script>

<style lang="scss">

</style>