<template>
	<base-card>
		<h3 class="font-bold text-xl mb-4">{{ $t('statistics.viewsPerCountry') }}</h3>
		<ol class="list-decimal divide-y divide-gray-200 overflow-y-auto">
			<li
				class="px-2 py-2 sm:py-4 flex justify-between"
				v-for="(country, i) in Analytics.countries"
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

	public get Analytics() {
		return this.analytics ?? {
			countries: [],
			count: 0,
			activity: [],
			lyrics: [],
		};
	}
}
</script>
