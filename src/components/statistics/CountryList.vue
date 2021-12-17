<template>
	<BaseCard>
		<template #header>
			<h3 class="font-bold text-xl">{{ $t('statistics_viewsPerCountry') }}</h3>
		</template>
		<ol class="list-decimal shadow-scroll">
			<li
				class="px-2 py-2 rounded-md hover:bg-black/5 flex justify-between"
				v-for="(country, i) in sortedCountries"
				:key="country.country"
			>
				<span>{{ i+1 }}. {{ country.country }}</span>
				<span>{{ country.count }}</span>
			</li>
		</ol>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { IAnalyticsItem } from "songtreasures-api";

export default defineComponent({
	name: "country-list",
	props: {
		analytics: {
			type: Object as PropType<IAnalyticsItem>,
			required: true,
		},
	},
	computed: {
		sortedCountries() {
			const countries: {
				country: string;
				count: number;
			}[] = [];
			for (const a of this.analytics.activity ?? []) {
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
		},
	},
});
</script>

<style lang="scss">
@import "../../style/mixins";

.shadow-scroll {
    @include scrollShadow(white);
    max-height: 400px;
    overflow-y: auto;
}

.dark {
    .shadow-scroll {
        @include scrollShadow(#213F47);
    }
}
</style>
