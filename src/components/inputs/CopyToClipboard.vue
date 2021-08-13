<template>
	<div class="flex gap-2 items-center">
		<base-button
			class="px-2 py-1 mr-2 rounded-md bg-black bg-opacity-10 hover:bg-opacity-20"
			@click="copy()"
			:content="label != undefined"
		>
			<template #icon>
				<ClipboardCopyIcon class="w-4 h-4" />
			</template>
			{{ label }}
		</base-button>
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
