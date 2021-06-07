<template>
	<div class="p-4 md:p-8">
		<back-button />
		<header class="flex flex-col mb-4">
			<h1 class="font-bold text-3xl">{{ $t('song.song') }} {{ $t('common.statistics').toLocaleLowerCase() }}</h1>
			<p class="text-primary">{{ song?.getName(languageKey) }}</p>
		</header>
		<div class="mb-4 rounded-md border border-gray-400 p-2 flex gap-2 flex-col md:flex-row md:items-end md:gap-4 md:p-4">
			<base-input type="date" v-model="fromDate" label="From date..." />
			<base-input type="date" v-model="toDate" label="To date..." />
			<base-button theme="secondary" @click="getAnalytics">{{ $t('statistics.update') }}</base-button>
		</div>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<base-card class="sm:col-span-2 md:col-span-3">
				<h3 class="font-bold text-xl mb-2">{{ $t('statistics.total') }}</h3>
				<p class="text-gray-400 text-3xl">{{ viewCount }}</p>
			</base-card>
			<line-chart :analytics="analytics" class="md:col-span-2" />
			<country-list :analytics="analytics" />
		</div>
	</div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { Options, Vue } from "vue-class-component";
import { analytics } from "@/services/api";
import { LineChart, CountryList } from "@/components/statistics";
import { appSession } from "@/services/session";

@Options({ 
	name: "song-statistics",
	components: {
		LineChart,
		CountryList,
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
