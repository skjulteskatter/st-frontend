<template>
	<BaseCard>
		<template #header>
			<div class="flex gap-4 items-center justify-between">
				<h4 class="font-bold tracking-wide">{{ $t("common_settings") }}</h4>
				<span class="text-xs tracking-wider bg-green-500/20 text-green-600 rounded px-2 py-1">BETA</span>
			</div>
		</template>
		<h4 class="uppercase text-xs tracking-wider opacity-50 mb-2">{{ $t('common_color') }}{{ $t('common_theme').toLocaleLowerCase() }}</h4>
		<div class="grid grid-cols-2 gap-4 mb-4">
			<button
				v-for="i in themes"
				:key="i"
				class="p-4 rounded-md"
				:class="{
					'ring-2 ring-green-500': i === theme,
					'bg-white text-black border border-black/20': i === 'light',
					'bg-black text-white': i === 'dark',
				}"
				@click="selectTheme(i)"
			>
				<span class="block font-bold text-xs uppercase tracking-wider flex justify-between">
					{{ $t(`common_${i}`) }}
					<CheckCircleIcon class="w-4 h-4 text-green-500" v-if="i === theme" />
				</span>
			</button>
		</div>
		<SwitchGroup as="div" class="flex gap-2 items-center cursor-pointer">
			<Switch
				v-model="Sidebar"
				class="focus-visible:outline-none"
			>
				<div
					class="relative inline-flex items-center h-6 rounded-full w-10 transition-colors"
					:class="Sidebar ? 'bg-primary' : 'bg-black/20 dark:bg-white/40'"
				>
					<span
						:class="Sidebar ? 'translate-x-5' : 'translate-x-1'"
						class="shadow-md inline-block w-4 h-4 transform bg-white rounded-full transition-transform dark:bg-secondary"
					/>
				</div>
			</Switch>
			<SwitchLabel class="uppercase text-xs tracking-wider opacity-50">Show sidepanel</SwitchLabel>
		</SwitchGroup>
		<SwitchGroup as="div" class="flex gap-2 items-center cursor-pointer">
			<Switch
				v-model="SingleVerse"
				class="focus-visible:outline-none"
			>
				<div
					class="relative inline-flex items-center h-6 rounded-full w-10 transition-colors"
					:class="SingleVerse ? 'bg-primary' : 'bg-black/20 dark:bg-white/40'"
				>
					<span
						:class="SingleVerse ? 'translate-x-5' : 'translate-x-1'"
						class="shadow-md inline-block w-4 h-4 transform bg-white rounded-full transition-transform dark:bg-secondary"
					/>
				</div>
			</Switch>
			<SwitchLabel class="uppercase text-xs tracking-wider opacity-50">Single verse</SwitchLabel>
		</SwitchGroup>
		<SwitchGroup as="div" class="flex gap-2 items-center cursor-pointer">
			<Switch
				v-model="Sync"
				class="focus-visible:outline-none"
			>
				<div
					class="relative inline-flex items-center h-6 rounded-full w-10 transition-colors"
					:class="Sync ? 'bg-primary' : 'bg-black/20 dark:bg-white/40'"
				>
					<span
						:class="Sync ? 'translate-x-5' : 'translate-x-1'"
						class="shadow-md inline-block w-4 h-4 transform bg-white rounded-full transition-transform dark:bg-secondary"
					/>
				</div>
			</Switch>
			<SwitchLabel class="uppercase text-xs tracking-wider opacity-50">Sync</SwitchLabel>
		</SwitchGroup>
	</BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/solid";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";

export default defineComponent({
	name: "presentation-theme-selector",
	components: {
		CheckCircleIcon,
		Switch,
		SwitchGroup,
		SwitchLabel,
	},
	props: {
		theme: {
			type: String,
		},
		showSideBar: {
			type: Boolean,
		},
		singleVerse: {
			type: Boolean,
		},
		sync: {
			type: Boolean,
		}
	},
	data: () => ({
		themes: ["dark", "light"],
	}),
	emits: ["setTheme", "toggleSidebar", "toggleSingleVerse", "update:sync"],
	computed: {
		Sidebar: {
			get() {
				return this.showSideBar ?? true;
			},
			set(v: boolean) {
				this.$emit("toggleSidebar", v);
			},
		},
		SingleVerse: {
			get() {
				return this.singleVerse ?? false;
			},
			set(v: boolean) {
				this.$emit("toggleSingleVerse", v);
			},
		},
		Sync: {
			get() {
				return this.sync ?? false;
			},
			set(v: boolean) {
				this.$emit("update:sync", v)
			}
		}
	},
	methods: {
		selectTheme(theme: string) {
			this.$emit("setTheme", theme);
		},
	},
});
</script>
