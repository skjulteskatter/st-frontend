<template>
	<div class="py-2">
		<label class="font-bold">
			<!-- <input
				type="checkbox"
			/> -->
			{{ name }}
		</label>
		<label
			class="flex items-center gap-2"
			v-for="label in labels"
			:key="label"
		>
			<input
				v-model="values[label]"
				type="checkbox"
				:name="label"
				class="border-gray-300 rounded text-primary focus:ring-primary"
			/>
			{{ $t(`types.${label}`) }}
		</label>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	name: "checkbox-group",
	props: {
		name: {
			type: String,
		},
		labels: {
			type: Array,
		},
		values: {
			type: Object,
		},
	}
})
export default class CheckboxGroup extends Vue {
	public name?: string;
	public labels?: string[];
	public values?: {
		[id: string]: boolean;
	};
}
</script>
