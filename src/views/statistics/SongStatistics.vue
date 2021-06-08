<template>
	<div class="p-4 md:p-8">
		<back-button />
		<header class="flex flex-col mb-4">
			<h1 class="font-bold text-3xl">{{ $t('song.song') }} {{ $t('common.statistics').toLocaleLowerCase() }}</h1>
			<p class="text-primary">{{ song?.getName(languageKey) }}</p>
		</header>
		<loader :loading="loading" />
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<div class="md:col-span-2 rounded-md border border-gray-400 p-2 flex gap-2 flex-col lg:flex-row lg:items-end lg:gap-4 lg:p-4">
				<base-input type="date" v-model="fromDate" :label="$t('statistics.startDate')" />
				<base-input type="date" v-model="toDate" :label="$t('statistics.endDate')" />
				<base-button
					theme="secondary"
					@click="getAnalytics"
					icon="refresh"
				>{{ $t('statistics.update') }}</base-button>
			</div>
			<base-card>
				<h3 class="font-bold text-xl mb-2">{{ $t('statistics.total') }}</h3>
				<p class="text-gray-400 text-3xl">{{ viewCount }}</p>
			</base-card>
			<line-chart :series="Series" class="md:col-span-2" />
			<country-list :analytics="analytics" />
			<base-card class="most-viewed md:col-span-3">
				<h1>Mest åpnede sanger</h1>
				<div v-for="(song, i) in MostViewed" :key="song.id">
					<router-link 
						:to="{name: 'song', params: 
						{
							number: song.number,
							collection: collections.find(c => song.collectionIds.includes(c.id))?.key
						}}"
					>{{i + 1}}. {{song.getName(languageKey)}} ({{mostViewed[song.id]}})</router-link>
				</div>
			</base-card>
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
	public fromDate = "2021-06-01";
	public toDate = "2021-06-05";
	public loading = false;
	public mostViewed: {
		[key: string]: number;
	} = {};

	public get songId() {
		return this.$route.params.id as string | undefined;
	}

	public get collections() {
		return this.store.getters.collections;
	}

	public get MostViewed() {
		const mostViewed = Object.keys(this.mostViewed);
		return appSession.songs.filter(s => mostViewed.includes(s.id)).sort((a, b) => this.mostViewed[a.id] > this.mostViewed[b.id] ? -1 : 1).slice(0, 100);
	}

	public async beforeMount() {
		if (this.songId) {
			this.loading = true;
			try {
				this.viewCount = await analytics.getViewsForSong(this.songId);
				this.mostViewed = await analytics.getMostViewed();
			}
			catch (e) {
				//
			}
			try {
				await this.getAnalytics();
			}
			catch (e) {
				//
			}
			this.loading = false;
		}
	}

	public getAnalyticsBase(fromDate: string, endDate: string) {
		const analytics: AnalyticsItem = {
			count: 0,
			activity: [],
			lyrics: [],
		};

		const date = new Date(fromDate);
		const toDate = new Date(endDate);

		while(date <= toDate) {
			for (let i = 0; i < 12; i++) {
				const d = new Date(`${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}-${date.getFullYear()} ${(i * 2).toString().padStart(2, "0")}:00`);
				
				analytics.activity.push({
					dateHour: d,
					countries: [],
					count: 0,
				});
			}

			date.setDate(date.getDate() + 1);
		}

		return analytics;
	}

	public get song() {
		return appSession.songs.find(s => s.id == this.$route.params.id);
	}

	public get languageKey() {
		return this.store.getters.languageKey;
	}

	public get Series() {
		// const countries: {
		// 	name: string;
		// 	data: unknown[];
		// }[] = [];

		// for (const a of this.analytics?.activity ?? []) {
		// 	for (const c of a.countries) {
				
		// 	}
		// }

		return [
			{
				name: this.$t("statistics.views"),
				data: this.analytics?.activity?.map(a => ({
					x: new Date(a.dateHour),
					y: a.count ?? 0,
				})) ?? [],
			},
		];
	}

	public async getAnalytics() {
		if (this.song) {
			this.loading = true;
			try {
				const base = this.getAnalyticsBase(this.fromDate, this.toDate);

				const result = await analytics.getForSong(this.song.id, new Date(this.fromDate), new Date(this.toDate));

				base.count = result.count;
				base.lyrics = result.lyrics;

				for (const a of result.activity) {
					a.dateHour = new Date(a.dateHour);
					
					const entry = base.activity.find(e => e.dateHour.getTime() == a.dateHour.getTime());

					if (entry) {
						entry.count = a.count;
						entry.countries = a.countries;
					} else {
						base.activity.push(a);
					}
				}

				base.activity = base.activity.sort((a, b) => a.dateHour > b.dateHour ? 1 : -1);

				this.analytics = base;
			}
			catch (e) {
				//
			}
			this.loading = false;
		}
	}
}
</script>
