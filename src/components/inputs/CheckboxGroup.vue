<template>
	<div>
		<label class="font-bold">
			{{ name }}
		</label>
		<label
			class="flex items-center gap-2"
			v-for="label in Labels"
			:key="label"
		>
			<input
				v-model="Values[label]"
				type="checkbox"
				:name="label"
				class="border-gray-300 rounded text-primary focus:ring-primary"
				@change="action"
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
		action: {
			type: Function,
		},
	},
})
export default class CheckboxGroup extends Vue {
	public name?: string;
	public labels?: string[];
	public values?: {
		[id: string]: boolean;
	};
	public action?: () => undefined;

	public get Values() {
		return this.values ?? {};
	}

	public get Labels() {
		return this.labels ?? [];
	}
}
</script>
