<template>
	<transition
		leave-active-class="transition duration-300 ease-in"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div v-if="loading" class="fixed inset-0 z-40 bg-white flex flex-col justify-center items-center p-8">
			<img class="h-20 drop-shadow-lg animate-pulse mb-10" src="/img/logo/dark.svg" alt="SongTreasures logo" height="80">
			<div class="rounded-full h-1 max-w-sm w-full bg-gray-200 overflow-hidden">
				<div class="loading-bar bg-primary h-full"></div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
	name: "splash-screen",
	props: {
		loading: {
			type: Boolean,
			default: true,
		},
	},
});
</script>

<style scoped>
.loading-bar {
	animation: loading-bar 3s linear;
	animation-fill-mode: forwards;
}

@keyframes loading-bar {
	0% {
		width: 0%;
	}
	25% {
		width: 25%;
	}
	40% {
		width: 25%;
	}
	50% {
		width: 50%;
	}
	75% {
		width: 50%;
	}
	100% {
		width: 90%;
	}
}
</style>
