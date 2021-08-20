<template>
	<div class="flex gap-2 items-center">
		<button
			class="text-sm px-2 py-1 flex items-center gap-2 rounded-md bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
			@click="copy()"
		>
			<ClipboardCopyIcon class="w-4 h-4" />
			{{ label }}
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
import { ClipboardCopyIcon } from "@heroicons/vue/solid";

@Options({
	props: {
		content: {
			type: String,
			required: true,
		},
		label: {
			type: String,
		},
	},
	components: {
		TransitionRoot,
		ClipboardCopyIcon,
	},
})
export default class CopyToClipboard extends Vue {
	public label?: string;
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
