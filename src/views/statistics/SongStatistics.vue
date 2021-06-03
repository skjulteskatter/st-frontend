<template>
	<div class="p-4 md:p-8">
		<back-button />
		<header class="flex gap-4 mb-4">
			<h1 class="font-bold text-2xl md:text-3xl">{{ song?.getName(languageKey) }}</h1>
		</header>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<base-card>
				<h3 class="font-bold text-xl mb-2">View count</h3>
				<p class="text-gray-500 text-xl">{{ viewCount }}</p>
			</base-card>
		</div>
	</div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { analytics } from "@/services/api";

@Options({ 
	name: "song-statistics",
})
export default class SongStatistics extends Vue {
	private store = useStore();
	public viewCount = 0;

	public async mounted() {
		try {
            if (this.song?.id) {
                this.viewCount = await analytics.getViewsForSong(this.song.id);
            }
        }
        catch (e) {
            //
        }
	}

	public get languageKey() {
		return this.store.getters.languageKey;
	}

	public getAnalytics() {
        return analytics.getForSong(this.song?.id as string);
    }

	public get song() {
        return this.store.getters.song;
    }
}
</script>
