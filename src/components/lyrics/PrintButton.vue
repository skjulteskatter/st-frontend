<template>
	<button
		class="px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
		title="Print"
		@click="print()"
	>
		<PrinterIcon class="w-5 h-5 opacity-75" />
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import { PrinterIcon } from "@heroicons/vue/solid";
import Lyrics, { printLyrics } from "@/classes/lyrics";


export default defineComponent({
	name: "print-button",
	components: {
		PrinterIcon,
	},
	methods: {
		print() {
			printLyrics.value = this.lyrics ?? null;
			this.$router.push("/print");
		},
	},
	props: {
		lyrics: {
            type: Object as PropType<Lyrics | null | undefined>,
        },
	},
});
</script>
