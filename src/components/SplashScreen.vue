<template>
	<transition-root
		as="template"
		:show="loading"
		leave="transition duration-200"
		leave-from="opacity-100"
		leave-to="opacity-0"
	>
		<section class="fixed inset-0 z-40 bg-gray-200 flex flex-col">

			<!-- Header -->
			<div class="bg-white shadow-md">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div class="flex gap-4 items-center justify-between h-16">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<img class="h-8 w-8" src="/img/logo/icon.svg" alt="SongTreasures logo" />
							</div>
							<div class="hidden md:block">
								<div class="ml-10 flex items-baseline space-x-8">
									<span class="rounded-md bg-gray-200 animate-pulse h-4 w-16"></span>
									<span class="rounded-md bg-gray-200 animate-pulse h-4 w-16"></span>
									<span class="rounded-md bg-gray-200 animate-pulse h-4 w-16"></span>
								</div>
							</div>
						</div>
						<span class="w-8 h-8 rounded-full bg-gray-200 animate-pulse hidden md:flex ml-4 md:ml-6"></span>
						<span class="md:hidden rounded-md w-6 h-6 bg-gray-200 animate-pulse"></span>
					</div>
				</div>
			</div>

			<!-- Main content -->
			<div class="flex-grow w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div class="rounded-md bg-gray-300 animate-pulse h-8 w-80 mb-6"></div>
				<div class="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
					<div class="flex flex-col gap-4 p-6 rounded-lg bg-white xl:col-span-2">
						<span class="mb-2 h-4 w-20 rounded-md bg-gray-200 animate-pulse"></span>
						<div class="p-1 flex gap-4 items-center">
							<span class="w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<span class="w-full max-w-sm h-4 rounded-md bg-gray-200 animate-pulse"></span>
						</div>
						<div class="p-1 flex gap-4 items-center">
							<span class="w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<span class="w-full max-w-sm h-4 rounded-md bg-gray-200 animate-pulse"></span>
						</div>
						<div class="p-1 flex gap-4 items-center">
							<span class="w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<span class="w-full max-w-sm h-4 rounded-md bg-gray-200 animate-pulse"></span>
						</div>
					</div>
					<div class="flex flex-col gap-4 p-6 rounded-lg bg-white">
						<span class="mb-2 h-4 w-20 rounded-md bg-gray-200 animate-pulse"></span>
						<div class="flex gap-4 p-1">
							<span class="p-1 w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<div class="flex flex-col justify-around">
								<span class="w-10 h-2 rounded-md bg-gray-200 animate-pulse"></span>
								<span class="w-20 h-4 rounded-md bg-gray-200 animate-pulse"></span>
							</div>
						</div>
						<div class="flex gap-4 p-1">
							<span class="p-1 w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<div class="flex flex-col justify-around">
								<span class="w-10 h-2 rounded-md bg-gray-200 animate-pulse"></span>
								<span class="w-20 h-4 rounded-md bg-gray-200 animate-pulse"></span>
							</div>
						</div>
						<div class="flex gap-4 p-1">
							<span class="p-1 w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<div class="flex flex-col justify-around">
								<span class="w-10 h-2 rounded-md bg-gray-200 animate-pulse"></span>
								<span class="w-20 h-4 rounded-md bg-gray-200 animate-pulse"></span>
							</div>
						</div>
					</div>
					<div class="flex flex-col gap-4 p-6 rounded-lg bg-white">
						<span class="mb-2 h-4 w-20 rounded-md bg-gray-200 animate-pulse"></span>
						<div class="flex gap-4 p-1">
							<span class="p-1 w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<div class="flex flex-col justify-around">
								<span class="w-20 h-4 rounded-md bg-gray-200 animate-pulse"></span>
								<span class="w-10 h-2 rounded-md bg-gray-200 animate-pulse"></span>
							</div>
						</div>
						<div class="flex gap-4 p-1">
							<span class="p-1 w-10 h-10 rounded-md bg-gray-200 animate-pulse"></span>
							<div class="flex flex-col justify-around">
								<span class="w-20 h-4 rounded-md bg-gray-200 animate-pulse"></span>
								<span class="w-10 h-2 rounded-md bg-gray-200 animate-pulse"></span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<img class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse w-20 h-20 drop-shadow-lg" src="/img/logo/icon.svg" alt="SongTreasures logo">
		</section>
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
		},
	},
	components: {
		TransitionRoot,
	},
})
export default class SplashScreen extends Vue {
	public loading?: boolean;
}
</script>
