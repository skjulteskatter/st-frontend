<template>
	<base-card>
		<h2 class="font-bold text-xl">{{ $t('statistics.viewsOverTime') }}</h2>
		<chart 
			width="100%"
			type="line"
			:options="options"
			:series="series"
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
		options: {
			type: Object,
			default: {
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
				tooltip: {
					x: {
						format: "dd MMM HH:mm",
					},
				},
			},
		},
		series: {
			type: Array,
		},
	},
})
export default class LineChart extends Vue {
	public options?: unknown;
	public series?: unknown[];
}
</script>
