<template>
	<div>
		<h1 class="font-bold text-2xl mb-4">{{$t('favorites')}}</h1>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" v-if="songs.length">
			<SongListItemCard v-for="song in songs" :key="song.id" :song="song" @click="song.view()" />
		</div>
			<div v-else class="opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center">
			<span class="rounded-full p-4 bg-black/10 dark:bg-white/10">
				<HeartIcon class="w-8 h-8" />
			</span>
			<h2>{{ $t('favorites_none') }}</h2>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { appSession } from "@/services/session";
import { SongListItemCard } from "@/components/songs";
import { HeartIcon } from "@heroicons/vue/outline";

export default defineComponent({
	name: "favorites-view",
	components: {
		SongListItemCard,
		HeartIcon,
	},
	computed: {
		songs() {
			return appSession.songs.filter(s => appSession.favorites.has(s.id));
		},
	},
});
</script>
