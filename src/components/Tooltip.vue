<template>
	<div class="relative" @mouseenter="showTooltip" @mouseleave="hideTooltip">
		<span class="w-4 h-4 rounded-full bg-secondary text-white text-sm font-bold flex justify-center items-center">?</span>
		<div class="absolute top-auto p-2 bg-secondary rounded shadow z-10" v-if="open">
			<small class="text-white font-normal leading-tight">{{ text }}</small>
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
	&__box {
		animation: tooltip 1000ms;
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
