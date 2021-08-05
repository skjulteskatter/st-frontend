<template>
	<div>
		<button
			class="px-2 py-1 mr-2 rounded-md bg-black bg-opacity-10 hover:bg-opacity-20"
			@click="copy()"
		>
			<icon name="clipboard" size="20" />
		</button>
		<TransitionRoot
			:show="copied"
			as="small"
			enter="transition"
			enter-from="opacity-0"
			enter-to="opacity-100"
			leave="transition"
			leave-from="opacity-100"
			leave-to="opacity-0"
		>
			Copied!
		</TransitionRoot>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { TransitionRoot } from "@headlessui/vue";

@Options({
	props: {
		content: {
			type: String,
			required: true,
		},
	},
	components: {
		TransitionRoot,
	},
})
export default class CopyToClipboard extends Vue {
	public content?: string;
	private copied = false;

	public copy() {
		if(this.content) {
			navigator.clipboard.writeText(this.content);
			this.confirmCopy();
		}
	}

	public confirmCopy() {
		this.copied = true;
		setTimeout(() => this.copied = false, 2000);
	}
}
</script>
