<template>
	<div class="flex flex-col gap-1">
		<label v-if="title" class="font-bold">
			{{ title }}
		</label>
		<Checkbox 
			v-for="item in items"
			:key="item.key"
			v-model="item.value"
			:name="item.label"
		>
			{{ item.label }}
		</Checkbox>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Checkbox from "./Checkbox.vue";

export default defineComponent({
	name: "checkbox-list",
	components: {
		Checkbox,
	},
	props: {
        items: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: Array as PropType<any[]>,
            required: true,
        },
        title: {
            type: String,
        },
	},
});
</script>
