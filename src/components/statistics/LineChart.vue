<template>
	<base-card>
		<h2 class="font-bold text-xl">{{ $t('statistics.viewsOverTime') }}</h2>
		<chart 
			width="100%"
			type="line"
			:options="options"
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
	public options = {
		chart: {
			id: "song-statistics",
			fontFamily: "Inter",
		},
		colors: ["var(--st-color-primary)", "var(--st-color-secondary)"],
		stroke: {
			curve: "smooth",
		},
		xaxis: {
			type: "datetime",
		},
	};

	public get Series(): {
		name: string;
		data: {
			x: Date;
			y: number;
		}[];
	}[] {
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
}
</script>
