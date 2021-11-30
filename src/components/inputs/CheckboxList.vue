<template>
	<div class="flex flex-col gap-1">
		<label v-if="title" class="font-bold">
			{{ title }}
		</label>
		<Checkbox 
			v-for="item in Items"
			:key="item.key"
			v-model="item.value"
			:name="item.label"
		>
			{{ item.label }}
		</Checkbox>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Checkbox from "./Checkbox.vue";

export default defineComponent({
	name: "checkbox-list",
	components: {
		Checkbox,
	},
	props: {
        items: {
            type: Array as PropType<CheckboxListData>,
            required: true,
        },
        title: {
            type: String,
        },
	},
	computed: {
		Items() {
			return this.items as CheckboxListData;
		},
	},
});
</script>
