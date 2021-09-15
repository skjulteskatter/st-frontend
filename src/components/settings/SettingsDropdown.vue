<template>
	<base-dropdown origin="right">
		<template #button>
			<img v-if="user && user.image" :src="user.image" class="w-6 h-6 rounded-full object-cover" width="24" height="24">
			<icon name="user" v-else />
		</template>
		
		<div class="flex flex-col gap-2 min-w-max">
			<span class="ml-auto">
				<icon name="moon" @click="themes.setTheme('dark')" class="dark:hidden cursor-pointer" />
				<icon name="sun" @click="themes.setTheme('light')" class="hidden dark:block cursor-pointer" />
			</span>
			<select
				v-model="selectedLanguage"
				@change="setLanguage"
				class="rounded-md border-gray-300 text-sm bg-transparent dark:border-gray-500"
			>
				<option
					v-for="lang in languages"
					:key="lang.key"
					:value="lang"
				>{{ lang.name }}</option>
			</select>
			<select
				v-model="selectedKey"
				@change="setKey"
				class="rounded-md border-gray-300 text-sm bg-transparent dark:border-gray-500"
			>
				<option
					v-for="key in transpositions"
					:key="key"
					:value="key"
				>{{ key }}</option>
			</select>
			<router-link
				:to="{ name: 'settings' }"
				class="text-sm rounded-md bg-black bg-opacity-10 px-3 py-2 hover:bg-opacity-20 flex items-center"
			>
				<icon name="settings" size="18" class="mr-2" />
				<span>{{ $t('settings_goToSettings') }}</span>
			</router-link>
            <base-button
                theme="error"
                icon="logout"
                @click="logout"
                class="settings-page__logout"
            >
                {{ $t("common_logout") }}
            </base-button>
		</div>
	</base-dropdown>
</template>

<script lang="ts">
import themes, { Themes } from "@/classes/themes";
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { Vue } from "vue-class-component";

export default class SettingsDropdown extends Vue {
	private store = useStore();
	public theme = localStorage.getItem("theme") ?? "dark";
    public themes: Themes = themes;
	public selectedLanguage: Language = {} as Language;
	public selectedKey = "";

	public transpositions = [
        "Ab",
        "A",
        "Bb",
        "B",
        "C",
        "Db",
        "D",
        "Eb",
        "E",
        "F",
        "F#",
        "G",
    ];

	public mounted() {
		this.selectedLanguage =
            this.languages.find(
                (l) => l.key == this.user?.settings?.languageKey,
            ) ??
            this.languages.find((l) => l.key == "no") ??
            ({} as Language);

        this.selectedKey = this.user?.settings?.defaultTransposition ?? "C";
	}

    public logout() {
        this.store.dispatch(SessionActionTypes.SESSION_CLEAR).then(() => {
            window.location.replace("/login");
        });
    }


	public async save() {
        await this.store.dispatch(SessionActionTypes.SESSION_SAVE_SETTINGS);
	}

	public setLanguage() {
        const settings = Object.assign({}, this.user?.settings);
        const language = this.selectedLanguage;
        if (language) {
            settings.languageKey = language.key;
            this.store.commit(SessionMutationTypes.SET_SETTINGS, settings);
			this.save();
        }
    }

    public setKey() {
        const settings = Object.assign({}, this.user?.settings);
        const key = this.selectedKey;
        if (key) {
            settings.defaultTransposition = key;
            this.store.commit(SessionMutationTypes.SET_SETTINGS, settings);
			this.save();
        }
    }

	public get user() {
		return this.store.getters.user;
	}

	public get languages(): Language[] {
        return appSession.languages || [];
    }
}
</script>
