<template>
	<base-card>
		<h2 class="font-bold text-xl">Views over time</h2>
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
				id: "example",
				fontFamily: "Inter",
			},
			colors: ["var(--st-color-primary)", "var(--st-color-secondary)"],
			labels: ["7. mai", "8. mai", "9. mai", "10. mai"],
		};
	}

	public get Series() {
		return [
			{
				name: "Activity",
				data: this.analytics?.activity?.map(a => a.dateHour) ?? [],
			},
		];
	}
}
</script>
