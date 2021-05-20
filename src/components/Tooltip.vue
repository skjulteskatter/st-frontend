<template>
	<div class="tooltip" @mouseenter="showTooltip" @mouseleave="hideTooltip">
		<span class="tooltip__button">?</span>
		<div class="tooltip__box" v-if="open">
			<small class="tootip__text">{{ text }}</small>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	props: {
		text: {
			type: String,
			required: true,
		},
	},
})
export default class Tooltip extends Vue {
	public text = "";

	private open = false;

	public showTooltip() {
		this.open = true;
	}

	public hideTooltip() {
		this.open = false;
	}
}
</script>

<style lang="scss">
.tooltip {
	color: var(--st-color-text-inverted);
	position: relative;
	font-weight: 400;
	font-size: 1rem;
	cursor: default;

	&__button {
		--tooltip-size: 1.2em;
		width: var(--tooltip-size);
		height: var(--tooltip-size);
		border-radius: 30em;
		background-color: var(--st-color-secondary);
		font-size: .9em;
		font-weight: bold;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	&__box {
		position: absolute;
		top: calc(100% + .2em);
		padding: .5em;
		background-color: var(--st-color-secondary);
		border-radius: var(--st-border-radius);
		animation: tooltip 1000ms;
		z-index: 9;
		box-shadow: 0 5px 10px rgba(black, .1);
	}	
}

@keyframes tooltip {
	0% {
		opacity: 0;
	}
	66% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
