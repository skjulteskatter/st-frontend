<template>
	<transition-root
		as="template"
		:show="loading"
		leave="transition duration-200"
		leave-from="opacity-100"
		leave-to="opacity-0"
	>
		<div class="fixed top-0 left-0 z-20 w-screen h-screen bg-white flex justify-center items-center p-8">
			<img src="/img/logo/dark.svg" alt="SongTreasures logo" class="max-w-xs animate-pulse">
		</div>
	</transition-root>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { TransitionRoot } from "@headlessui/vue";

@Options({
	name: "splash-screen",
	props: {
		loading: {
			type: Boolean,
			default: true,
		}
	},
	components: {
		TransitionRoot,
	},
})
export default class SplashScreen extends Vue {
	public loading?: boolean;
}
</script>
