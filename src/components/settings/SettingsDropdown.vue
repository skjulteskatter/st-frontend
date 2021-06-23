<template>
	<base-dropdown origin="right">
		<template #button>
			<img v-if="user && user.image" :src="user.image" class="w-6 h-6 rounded-full object-cover">
			<icon name="user" v-else />
		</template>
		
		<div class="flex flex-col gap-2 min-w-max">
			<icon name="moon" @click="themes.setTheme('dark')" class="dark:hidden cursor-pointer" />
			<icon name="sun" @click="themes.setTheme('light')" class="hidden dark:block cursor-pointer" />
			<router-link :to="{ name: 'settings' }">
				<p class="text-sm rounded bg-black bg-opacity-10 p-2 hover:bg-opacity-20">{{ $t('settings.goToSettings') }}</p>
			</router-link>
		</div>
	</base-dropdown>
</template>

<script lang="ts">
import themes, { Themes } from "@/classes/themes";
import { useStore } from "@/store";
import { Vue } from "vue-class-component";

export default class SettingsDropdown extends Vue {
	public store = useStore();
	public theme = localStorage.getItem("theme") ?? "dark";
    public themes: Themes = themes;

	public get user() {
		return this.store.getters.user;
	}
}
</script>
