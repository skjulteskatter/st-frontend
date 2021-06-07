<template>
	<base-card>
		<h3 class="font-bold text-xl mb-4">Top countries</h3>
		<ol class="list-decimal">
			<li 
				class="border-b border-gray-200 p-2 sm:p-4 flex justify-between"
				v-for="country in analytics?.countries"
				:key="country"
			>
				<span>{{ country.country }}</span>
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
}
</script>
