<template>
	<button class="p-1 rounded-full focus:ring-2 focus:ring-primary" @click="openPanel()">
		<QuestionMarkCircleIcon class="opacity-50 w-6 h-6" />
	</button>
	<slide-panel title="Help & Support" :open="open" @close="closePanel()">
		<div class="mt-auto">
			<iframe title="Feedback Form" class="freshwidget-embedded-form" id="freshwidget-embedded-form" src="https://songtreasures.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&formTitle=Send+feedback&submitTitle=Send+feedback&submitThanks=Thank+you!" scrolling="no" height="500px" width="100%" frameborder="0" >
			</iframe>
		</div>
	</slide-panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import SlidePanel from "@/components/SlidePanel.vue";
import { QuestionMarkCircleIcon } from "@heroicons/vue/outline";

@Options({
	name: "feedback",
	components: {
		SlidePanel,
		QuestionMarkCircleIcon,
	},
})
export default class Feedback extends Vue {
	public open = false;

	public openPanel() {
		this.open = true;
	}

	public closePanel() {
		this.open = false;
	}
}
</script>
