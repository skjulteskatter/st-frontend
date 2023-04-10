<template>
	<button aria-label="Feedback button" title="Feedback" class="p-1 mr-2 rounded-md focus-visible:ring-2 focus-visible:ring-primary hover:bg-black/5 dark:hover:bg-white/10" @click="openPanel()">
		<QuestionMarkCircleIcon class="opacity-50 w-6 h-6" />
	</button>
	<SlidePanel title="Feedback and support" :open="open" @close="closePanel()">
		<div class="mt-auto">
			<iframe title="Feedback Form" class="freshwidget-embedded-form" id="freshwidget-embedded-form" src="https://songtreasures.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&formTitle=Send+feedback&submitTitle=Send+feedback&submitThanks=Thank+you!" scrolling="no" height="500px" width="100%" frameborder="0" >
			</iframe>
		</div>
	</SlidePanel>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SlidePanel from "@/components/SlidePanel.vue";
import { QuestionMarkCircleIcon } from "@heroicons/vue/outline";

export default defineComponent({
	name: "feedback-component",
	components: {
		SlidePanel,
		QuestionMarkCircleIcon,
	},
	data: () => ({
		open: false,
	}),
	methods: {
		openPanel() {
			this.open = true;
		},
		closePanel() {
			this.open = false;
		},
	},
});
</script>
