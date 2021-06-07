<template>
	<base-card>
		<h2 class="font-bold text-xl">{{ $t('statistics.viewsOverTime') }}</h2>
		<chart 
			width="100%"
			type="line"
			:options="Options"
			:series="Series"
		/>
	</base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import VueApexCharts from "vue3-apexcharts";

@Options({
	name: "line-chart",
	components: {
		chart: VueApexCharts,
	},
	props: {
		analytics: {
			type: Object,
		},
	},
})
export default class LineChart extends Vue {
	public analytics?: AnalyticsItem;

	public get Options() {
		return {
			chart: {
				id: "song-statistics",
				fontFamily: "Inter",
			},
			colors: ["var(--st-color-primary)", "var(--st-color-secondary)"],
			labels: this.analytics?.activity?.map(a => a.dateHour) ?? [],
		};
	}

	public get Series() {
		return [
			{
				name: this.$t('statistics.views'),
				data: this.analytics?.activity?.map(a => a.count) ?? [],
			},
		];
	}
}
</script>
