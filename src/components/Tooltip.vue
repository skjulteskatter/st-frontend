<template>
	<div class="relative" @mouseenter="showTooltip" @mouseleave="hideTooltip" @click="showTooltip">
		<span class="w-4 h-4 rounded-full border border-secondary text-secondary text-sm flex justify-center items-center cursor-default dark:text-gray-300 dark:border-gray-300">?</span>
		<transition-root
			:show="open"
			as="div"
			id="tooltip"
			class="mb-2 absolute bottom-full px-2 py-1 bg-secondary rounded-md shadow z-10 dark:bg-white"
			:class="positionClasses"
			enter="transition"
			enter-from="opacity-0 translate-y-1"
			enter-to="opacity-100 translate-y-0"
			leave="transition"
			leave-from="opacity-100 translate-y-0"
			leave-to="opacity-0 translate-y-1"
		>
			<span
				class="bg-secondary w-2 h-2 rotate-45 absolute -bottom-0.5 dark:bg-white"
				:class="{ 'right-3': position == 'right', 'left-3': position == 'left' }"
			></span>
			<small class="text-white font-normal whitespace-nowrap dark:text-secondary">{{ text }}</small>
		</transition-root>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { TransitionRoot } from "@headlessui/vue";

@Options({
	name: "tooltip",
	props: {
		text: {
			type: String,
			required: true,
		},
	},
	components: {
		TransitionRoot,
	},
})
export default class Tooltip extends Vue {
	public text?: string;
	private open = false;
	public position = "left";

	public get positionClasses() {
		switch(this.position) {
			case "left": 
				return "-left-2";
			case "right":
				return "-right-2";
			default:
				return "right-1/2 -translate-x-1/2";
		}
	}

	public handlePosition(e: MouseEvent) {
		this.position = (e.clientX < window.innerWidth / 2) ? "left" : "right";
	}

	public showTooltip(e: MouseEvent) {
		this.handlePosition(e);
		this.open = true;
	}

	public hideTooltip() {
		this.open = false;
	}
}
</script>
