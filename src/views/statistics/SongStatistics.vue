<template>
	<div>
		<BackButton class="mb-4" />
		<header class="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
			<div>
				<h1 class="font-bold text-3xl">{{ $t('common_song') }} {{ $t('common_statistics').toLocaleLowerCase() }}</h1>
				<p class="text-primary">{{ song?.getName(languageKey) }}</p>
			</div>
			<div class="flex gap-2 flex-col lg:flex-row lg:items-end lg:gap-4">
				<BaseInput type="date" v-model="fromDate" :label="$t('statistics_startDate')" />
				<BaseInput type="date" v-model="toDate" :label="$t('statistics_endDate')" />
				<BaseButton
					class="flex-shrink-0"
					theme="secondary"
					@click="getAnalytics"
				>
					<template #icon>
						<RefreshIcon class="w-4 h-4" />
					</template>
					{{ $t('statistics_update') }}
				</BaseButton>
			</div>
		</header>
		<Loader :loading="loading" />
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:grid-rows-3">
			<LineChart :series="Series" class="md:col-span-2 md:row-span-3" />
			<BaseCard>
				<template #header>
					<h3 class="font-bold text-xl">{{ $t('statistics_total') }}</h3>
				</template>
				<div class="text-gray-400 text-4xl w-full h-full flex justify-center items-center gap-4">
					{{ viewCount }}
					<EyeIcon class="w-8 h-8 opacity-50" />
				</div>
			</BaseCard>
			<CountryList :analytics="analytics" class="md:row-span-2" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useStore } from "@/store";
import { analytics } from "@/services/api";
import { LineChart, CountryList } from "@/components/statistics";
import { appSession } from "@/services/session";
import { EyeIcon } from "@heroicons/vue/outline";
import { RefreshIcon } from "@heroicons/vue/solid";
import { IAnalyticsItem } from "songtreasures-api";

export default defineComponent({ 
	name: "song-statistics",
	components: {
		LineChart,
		CountryList,
		EyeIcon,
		RefreshIcon,
	},
	data: () => ({
		store: useStore(),
		analytics: {} as IAnalyticsItem,
		date: new Date(),
		loading: false,
		mostViewed: {} as {
			[key: string]: number;
		},
	}),
	computed: {
		fromDate() {
			const d = new Date();
			d.setTime(this.date.getTime() - (1000*60*60*24*7));
			return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
		},
		toDate() {
			const d = new Date();
			d.setTime(this.date.getTime() - (1000*60*60*24));
			return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
		},
		songId() {
			return this.$route.params.id as string | undefined;
		},
		collections() {
			return appSession.collections;
		},
		MostViewed() {
			const mostViewed = Object.keys(this.mostViewed);
			return appSession.songs.filter(s => mostViewed.includes(s.id)).sort((a, b) => this.mostViewed[a.id] > this.mostViewed[b.id] ? -1 : 1).slice(0, 100);
		},
		viewCount() {
			return this.analytics?.count;
		},
		song() {
			return appSession.songs.find(s => s.id == this.$route.params.id);
		},
		languageKey() {
			return this.store.getters.languageKey;
		},
		Series() {
			return [
				{
					name: this.$t("statistics_views"),
					data: this.analytics?.activity?.map(a => ({
						x: a.dateHour,
						y: a.count ?? 0,
					})) ?? [],
				},
			];
		},
	},
	async beforeMount() {
		if (this.songId) {
			this.loading = true;
			try {
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
	},
	methods: {
		getAnalyticsBase(fromDate: string, endDate: string) {
			const analytics: IAnalyticsItem = {
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
		},
		async getAnalytics() {
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
		},
	},
});
</script>
