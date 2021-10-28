<template>
	<transition
		leave-active-class="transition duration-300 ease-in"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div v-if="loading" class="fixed inset-0 z-40 bg-white dark:bg-secondary">
			<img class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondaryanimate-pulse h-20 drop-shadow-lg animate-pulse" src="/img/logo/dark.svg" alt="SongTreasures logo" height="80">
		</div>
	</transition>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
	name: "splash-screen",
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
	},
})
export default class SplashScreen extends Vue {
	public loading?: boolean;
}
</script>
