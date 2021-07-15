<template>
    <div class="h-full flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold">Thank you for your purchase!</h1>
        <p>Your product should be available soon.</p>
        <div
            class="bg-gray-100 shadow-md p-4 mb-8 mt-8 rounded-md flex justify-center gap-8 max-w-sm"
        >
            <p class="text-gray-500 text-sm">Set your preferred language</p>
            <div class="flex items-center">
                <icon name="check" class="text-green-700 mr-4 p-1 rounded-full border border-green-700" v-if="languageSet" />
                <select
                    v-model="selectedLanguage"
                    @change="setLanguage"
                    class="rounded border-gray-300 text-sm bg-transparent dark:border-gray-500"
                >
                    <option
                        v-for="lang in languages"
                        :key="lang.key"
                        :value="lang"
                    >{{ lang.name }}</option>
                </select>
            </div>
        </div>
        <router-link
            class="text-primary hover:underline"
            to="/collections"
        >
            Go to collections
        </router-link>
    </div>
</template>
<script lang="ts">
import { appSession } from "@/services/session";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { Options, Vue } from "vue-class-component";

@Options({
    name: "success",
})
export default class Success extends Vue {
    public store = useStore();
	public selectedLanguage: Language = {} as Language;
    public languageSet = false;

    public mounted() {
        this.selectedLanguage =
            this.languages.find(
                (l) => l.key == this.user?.settings?.languageKey,
            ) ??
            this.languages.find((l) => l.key == "no") ??
            ({} as Language);
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
        this.languageSet = true;
    }

    public get user() {
		return this.store.getters.user;
	}

	public get languages(): Language[] {
        return appSession.languages || [];
    }
}
</script>
