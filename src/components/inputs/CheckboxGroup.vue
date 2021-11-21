<template>
	<div class="flex flex-col gap-1">
		<label class="text-xs opacity-50 uppercase tracking-wider">
			{{ name }}
		</label>
		<Checkbox
			v-for="(label, i) in Labels"
			:key="i"
			v-model="Values[label]"
			@change="action"
			:name="$t(`types_${label}`)"
		>
			{{ $t(`types_${label}`) }}
		</Checkbox>
	</div>
</template>

<script lang="ts">
import Checkbox from "./Checkbox.vue";
import { Options, Vue } from "vue-class-component";

@Options({
	name: "checkbox-group",
	components: {
		Checkbox,
	},
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
