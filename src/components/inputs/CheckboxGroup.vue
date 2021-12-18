<template>
	<div class="flex flex-col gap-1">
		<label class="text-xs opacity-50 uppercase tracking-wider">
			{{ name }}
		</label>
		<Checkbox
			v-for="(label, i) in Labels"
			:key="i"
			v-model="Values[label.key]"
			@change="action"
			:name="label.title"
		>
			{{ label.title }}
		</Checkbox>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Checkbox from "./Checkbox.vue";

type Values = {
	[id: string]: boolean;
}

type Label = {
	key: string;
	title: string;
}

export default defineComponent({
	name: "checkbox-group",
	components: {
		Checkbox,
	},
	props: {
		name: {
			type: String,
		},
		labels: {
			type: Array as PropType<Label[]>,
		},
		values: {
			type: Object as PropType<Values>,
		},
		action: {
			type: Function,
		},
	},
	computed: {
		Values() {
			return this.values ?? {};
		},
		Labels() {
			return this.labels ?? [];
		},
	},
});
</script>
