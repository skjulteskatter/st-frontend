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
import { Options, Vue } from "vue-class-component";
import { PrinterIcon } from "@heroicons/vue/solid";

@Options({
	components: {
		PrinterIcon,
	},
})
export default class PrintButton extends Vue {
	public print() {
		this.$router.push("/print");
	}
}
</script>
