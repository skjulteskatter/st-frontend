<template>
	<div class="p-4 md:p-8">
		<back-button />
		<header class="flex gap-4 mb-8">
			<h1 class="font-bold text-2xl md:text-3xl">{{ song?.getName(languageKey) }}</h1>
		</header>
		<input type="text" v-model="fromDate" placeholder="From date...">
		<input type="text" v-model="toDate" placeholder="To date...">
		<base-button @click="getAnalytics">Get</base-button>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<base-card>
				<h3 class="font-bold text-xl mb-2">View count</h3>
				<p class="text-gray-500 text-xl">{{ viewCount }}</p>
			</base-card>
			<line-chart :analytics="analytics" class="md:col-span-2" />
		</div>
	</div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { analytics } from "@/services/api";
import LineChart from "@/components/statistics/LineChart.vue";
import { appSession } from "@/services/session";

@Options({ 
	name: "song-statistics",
	components: {
		LineChart,
	},
})
export default class SongStatistics extends Vue {
	private store = useStore();
	public viewCount = 0;
	public analytics?: AnalyticsItem = {} as AnalyticsItem;
	public date = new Date();
	public fromDate = "";
	public toDate = "";

	public async beforeMount() {

		if (this.song?.id) {
			try {
				this.viewCount = await analytics.getViewsForSong(this.song.id);
			}
			catch (e) {
				//
			}
			try {
				this.analytics = await analytics.getForSong(this.song.id, new Date("2021-06-01"), new Date("2021-06-05"));
			}
			catch (e) {
				//
			}
		}
	}

	public get song() {
		return appSession.songs.find(s => s.id == this.$route.params.id);
	}

	public get languageKey() {
		return this.store.getters.languageKey;
	}

	public async getAnalytics() {
		if (this.song) {
			try {
				this.analytics = await analytics.getForSong(this.song.id, new Date(this.fromDate), new Date(this.toDate));
			}
			catch (e) {
				//
			}
		}
	}
}
</script>
