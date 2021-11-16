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
import Checkbox from "./Checkbox.vue";
import { Options, Vue } from "vue-class-component";

@Options({
	name: "checkbox-list",
	components: {
		Checkbox,
	},
	props: {
        items: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
        },
	},
})
export default class CheckboxList extends Vue {
	public items?: CheckboxListData;
    public title?: string;

    public get Items() {
        return this.items as CheckboxListData;
    }
}
</script>
