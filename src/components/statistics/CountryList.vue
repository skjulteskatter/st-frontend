<template>
	<base-card>
		<template #header>
			<h3 class="font-bold text-xl">{{ $t('statistics_viewsPerCountry') }}</h3>
		</template>
		<ol class="list-decimal overflow-y-auto">
			<li
				class="px-2 py-2 rounded-md hover:bg-black/5 flex justify-between"
				v-for="(country, i) in sortedCountries"
				:key="country"
			>
				<span>{{ i+1 }}. {{ country.country }}</span>
				<span>{{ country.count }}</span>
			</li>
		</ol>
	</base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	name: "country-list",
	props: {
		analytics: {
			type: Object,
			required: true,
		},
	},
})
export default class CountryList extends Vue {
	public analytics?: AnalyticsItem;

	public get sortedCountries() {
		const countries: {
			country: string;
			count: number;
		}[] = [];
		for (const a of this.Analytics.activity ?? []) {
			for (const c of a.countries ?? []) {
				let item = countries.find(i => i.country == c.country);
				if (!item) {
					item = {
						country: c.country,
						count: 0,
					};
					countries.push(item);
				}
				item.count += c.count;
			}
		}

		return countries.sort((a, b) => a.count > b.count ? -1 : 1);
	}

	public get Analytics() {
		return this.analytics ?? {
			count: 0,
			activity: [],
			lyrics: [],
		};
	}
}
</script>
