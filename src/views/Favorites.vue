<template>
	<h1 class="font-bold text-2xl mb-4">{{$t('favorites')}}</h1>
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" v-if="songs.length">
		<song-list-item-card v-for="song in songs" :key="song.id" :song="song" @click="song.view()" />
	</div>
    <div v-else>{{$t('favorites_none')}}</div>
</template>

<script lang="ts">
import { appSession } from "@/services/session";
import { Options, Vue } from "vue-class-component";
import { SongListItemCard } from "@/components/songs";

@Options({
	name: "favorites-view",
	components: {
		SongListItemCard,
	},
})
export default class Favorites extends Vue {
	public get songs() {
		return appSession.songs.filter(s => appSession.favorites.has(s.id));
	}
}
</script>
