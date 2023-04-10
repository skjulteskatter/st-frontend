<template>
	<div class="flex gap-2 items-center">
		<BaseButton
			theme="neutral"
			size="small"
			@click="copy()"
		>
			<template #icon>
				<ClipboardCopyIcon class="w-4 h-4 opacity-50" />
			</template>
			{{ label }}
		</BaseButton>
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
import { defineComponent } from "vue";
import { TransitionRoot } from "@headlessui/vue";
import { ClipboardCopyIcon } from "@heroicons/vue/solid";

export default defineComponent({
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
	data: () => ({
		copied: false,
	}),
	methods: {
		copy() {
			if(this.content) {
				navigator.clipboard.writeText(this.content);
				this.confirmCopy();
			}
		},
		confirmCopy() {
			this.copied = true;
			setTimeout(() => this.copied = false, 2000);
		},
	},
});
</script>
