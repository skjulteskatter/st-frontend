<template>
	<div class="relative" @mouseenter="showTooltip" @mouseleave="hideTooltip" @click="showTooltip">
		<QuestionMarkCircleIcon class="w-4 h-4 text-secondary dark:text-white" />
		<TransitionRoot
			:show="open"
			as="div"
			:class="['mb-2 absolute bottom-full px-2 py-1 bg-secondary rounded-md shadow z-10 dark:bg-white', positionClasses]"
			enter="transition duration-100 ease-out"
			enter-from="opacity-0 translate-y-1"
			enter-to="opacity-100 translate-y-0"
			leave="transition duration-50 ease-in"
			leave-from="opacity-100"
			leave-to="opacity-0"
		>
			<span
				class="bg-secondary w-2 h-2 rotate-45 absolute -bottom-0.5 dark:bg-white"
				:class="{ 'right-3': position == 'right', 'left-3': position == 'left', 'left-1/2 -translate-x-1/2': position == 'center' }"
			></span>
			<small class="text-white font-normal whitespace-nowrap dark:text-secondary">{{ text }}</small>
		</TransitionRoot>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { TransitionRoot } from "@headlessui/vue";
import { QuestionMarkCircleIcon } from "@heroicons/vue/solid";

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
		QuestionMarkCircleIcon,
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
			case "center":
				return "left-1/2 -translate-x-1/2";
			default:
				return "left-1/2 -translate-x-1/2";
		}
	}

	public handlePosition(e: MouseEvent) {
		const left = window.innerWidth / 2 - window.innerWidth / 6;
		const right = (window.innerWidth - window.innerWidth / 2) + window.innerWidth / 6;

		if(e.clientX < left) {
			this.position = "left";
		} else if(e.clientX > right) {
			this.position = "right";
		} else {
			this.position = "center";
		}
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
