<template>
	<base-card>
		<template #header>
			<div class="flex gap-4 items-center justify-between">
				<h4 class="text-sm font-bold tracking-wide">{{ $t('common.color') }}{{ $t('common.theme').toLocaleLowerCase() }}</h4>
				<span class="text-xs tracking-wider bg-green-500/20 text-green-600 rounded px-2 py-1">BETA</span>
			</div>
		</template>
		<div class="grid grid-cols-2 gap-4">
			<button
				v-for="i in themes"
				:key="i"
				class="text-left p-2 rounded-md"
				:class="{
					'ring-2 ring-green-500': i === theme,
					'bg-white text-black border border-black/20': i === 'light',
					'bg-black text-white': i === 'dark',
				}"
				@click="selectTheme(i)"
			>
				<span class="block font-bold text-xs uppercase tracking-wider flex justify-between">
					{{ $t(`common.${i}`) }}
					<CheckCircleIcon class="w-4 h-4 text-green-500" v-if="i === theme" />
				</span>
				<small clas="block tracking-wide leading-tight">Lorem ipsum dolor sit amet.</small>
			</button>
		</div>
	</base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { CheckCircleIcon } from "@heroicons/vue/solid";

@Options({
	name: "presentation-theme-selector",
	components: {
		CheckCircleIcon,
	},
	props: {
		theme: {
			type: String,
		},
	},
	emits: ["setTheme"],
})
export default class ThemeSelector extends Vue {
	public themes = ["dark", "light"];
	public theme?: string;

	public selectTheme(theme: string) {
		this.$emit("setTheme", theme);
	}
}
</script>
