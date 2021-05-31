<template>
	<div class="stepper">
		<ul class="stepper__breadcrumb">
			<li
				class="stepper__breadcrumb__item"
				v-for="step in Steps"
				:key="step.id"
				@click="callback ? callback(step.type) : undefined"
			>
				{{ step.name }}
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        steps: {
            type: Array,
            default: () => undefined,
        },
        callback: {
            type: Function,
            default: () => undefined,
        },
    },
    name: "stepper",
})
export default class Stepper extends Vue {
	public steps?: Step[];
	public callback?: Function;

	public get Steps() {
		return this.steps ?? [];
	}
}
</script>

<style lang="scss" scoped>
.stepper {
	&__breadcrumb {
		height: var(--st-spacing);
		padding: 0;
		opacity: 0.7;

		&__item {
			display: inline-block;
			margin-right: 0.5em;
			padding: 0;
			cursor: pointer;
			animation: slideIn 0.3s ease-in-out;

			&:not(:last-child):after {
				content: ">";
				padding-left: 0.5em;
				animation: slideIn 0.3s ease-in-out;
			}
		}
	}
}
</style>
