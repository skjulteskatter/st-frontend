<template>
	<h1 class="font-bold text-2xl mb-4">Favorites</h1>
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
		<song-list-item-card v-for="song in songs" :key="song.id" :song="song" @click="song.view()" />
	</div>
</template>

<script lang="ts">
import { appSession } from "@/services/session";
import { Options, Vue } from "vue-class-component";
import { useStore } from "vuex";
import { SongListItemCard } from "@/components/songs";

@Options({
	name: "favorites-view",
	components: {
		SongListItemCard,
	},
})
export default class Favorites extends Vue {
	public store = useStore();

	public get songs() {
		return appSession.songs.filter(s => this.favorites.includes(s.id));
	}
	
	public get favorites() {
		return this.store.getters.favorites;
	}
}
</script>
