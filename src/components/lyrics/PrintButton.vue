<template>
	<button
		class="px-3 py-2 rounded-md bg-black bg-opacity-10 hover:bg-opacity-20"
		title="Print"
		@click="print()"
	>
		<icon name="print" size="20" />
	</button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
})
export default class PrintButton extends Vue {
	public print() {
		this.$router.push("/print");
	}
}
</script>
