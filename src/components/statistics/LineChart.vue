<template>
	<BaseCard>
		<template #header>
			<h2 class="font-bold text-xl">{{ $t('statistics_viewsOverTime') }}</h2>
		</template>
		<Chart
			width="100%"
			type="line"
			:options="options"
			:series="series"
		/>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
	name: "line-chart",
	components: {
		Chart: VueApexCharts,
	},
	props: {
		options: {
			type: Object,
			default: () => ({
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
			}),
		},
		series: {
			type: Array,
		},
	},
});
</script>
