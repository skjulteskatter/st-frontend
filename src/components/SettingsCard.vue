<template>
    <base-card class="md:col-span-3" v-if="user">
        <div class="flex flex-col gap-2 mb-4">
            <h3 class="font-bold flex justify-between">
                {{ $t("settings.general") }}
                <base-button
                    @click="cache.clearCache()"
                    theme="error"
                >Clear cache</base-button>
            </h3>
            <div class="flex justify-between items-center gap-4 bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label for="theme-mode">{{ $t("common.theme") }}</label>
                <select
                    class="rounded border border-gray-300 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                    name="theme-mode"
                    id="theme-mode"
                    v-model="theme"
                    @change="themes.setTheme(theme)"
                >
                    <option :value="t" v-for="t in themes.keys" :key="t">
                        {{ t }}
                    </option>
                </select>
            </div>
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label for="language">{{ $t("common.language") }}</label>
                <select
                    class="rounded border border-gray-300 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                    id="language"
                    name="language"
                    v-model="selectedLanguage"
                    @change="setLanguage"
                >
                    <option
                        v-for="lang in languages"
                        :value="lang"
                        :key="lang.key"
                    >
                        {{ lang.name }}
                    </option>
                </select>
            </div>
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label for="transposition-key">{{ $t("song.key") }}</label>
                <select
                    class="rounded border border-gray-300 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                    id="transposition-key"
                    name="transposition-key"
                    v-model="selectedKey"
                    @change="setKey"
                >
                    <option v-for="k in transpositions" :value="k" :key="k">
                        {{ k }}
                    </option>
                </select>
            </div>
        </div>
        <div class="flex flex-col gap-2 mb-4">
            <h3 class="font-bold">
                {{ $t("common.user") }}
            </h3>
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label for="display-name">{{ $t("common.name") }}</label>
                <input
                    class="rounded border border-gray-300 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                    id="display-name"
                    type="text"
                    v-model="newDisplayName"
                    :placeholder="user.displayName"
                />
            </div>
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label for="gender">{{ $t("common.gender") }}</label>
                <select
                    class="rounded border border-gray-300 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                    id="gender"
                    name="gender"
                    v-model="gender"
                >
                    <option value="unknown" key="male">Not set</option>
                    <option value="male" key="male">Male</option>
                    <option value="male" key="male">Female</option>
                </select>
            </div>
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label for="birthDay">{{ $t("common.birthDay") }}</label>
                <input type="date" v-model="birthDay" />
            </div>
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label for="image">{{ $t("common.image") }}</label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    @change="handleImage"
                />
            </div>
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                <label>{{ $t("common.password") }}</label>
                <change-password />
            </div>
        </div>
        <base-button
            :loading="loading"
            @click="save"
            theme="secondary"
            icon="check"
            class="ml-auto"
        >
            {{ $t("common.save") }}
        </base-button>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import themes, { Themes } from "@/classes/themes";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { cache } from "@/services/cache";
import { ChangePassword } from "@/components/settings";
import { notify } from "@/services/notify";
import { appSession } from "@/services/session";
import { session } from "@/services/api";

@Options({
    components: {
        ChangePassword,
    },
    name: "settings-card",
})
export default class SettingsCard extends Vue {
    public cache = cache;
    public selectedLanguage: Language = {} as Language;
    public selectedKey = "";
    public selectedTranscode = "";
    public store = useStore();
    public themes: Themes = themes;
    public newDisplayName = "";
    public offline = false;
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
    public transcodes = [
        "common",
        "dutch",
        "german",
        "latin",
        "solfege",
        "scandinavian",
        "nashville",
        "roman",
    ];

    public get gender() {
        return this.user?.gender ?? "unknown";
    }
    
    public set gender(v: "male" | "female" | "unknown") {
        if (this.user) {
            this.user.gender = v;
        }
    }

    public get birthDay(): string {
        if (this.user) {
            const birthDay = new Date(this.user.birthDay);
            return `${birthDay.getFullYear()}-${(birthDay.getMonth() + 1).toString().padStart(2, "0")}-${birthDay.getDate().toString().padStart(2, "0")}`;
        }
        return new Date().toISOString();
    }

    public set birthDay(v: string) {
        if (this.user) {
            this.user.birthDay = v;
        }
    }

    public fileName = "";
    private selectedImage?: string;

    public theme = localStorage.getItem("theme") ?? "dark";
    public token = localStorage.getItem("id_token");

    public loading = false;

    public async mounted() {
        this.selectedLanguage =
            this.languages.find(
                (l) => l.key == this.user?.settings?.languageKey,
            ) ??
            this.languages.find((l) => l.key == "no") ??
            ({} as Language);

        this.selectedKey = this.user?.settings?.defaultTransposition ?? "C";

        this.selectedTranscode =
            this.user?.settings?.defaultTranscode ?? "common";
        
        this.gender = this.user?.gender ?? "unknown";
        
        this.offline = await cache.get("config", "offline") == true;
    }

    public async save() {
        this.loading = true;
        await session.saveProfile({
            gender: this.gender,
            birthDay: this.birthDay,
        });
        await this.store.dispatch(SessionActionTypes.SESSION_SAVE_SETTINGS);
        this.themes.setTheme(this.theme);
        this.submitImage();
        if (this.newDisplayName) {
            this.setDisplayName();
        }

        // Fire a success notification
        notify("success", this.$t("notification.saved"), "check");
        this.loading = false;
    }

    public setOffline() {
        cache.set("config", "offline", this.offline);
    }

    public handleImage(e: InputEvent) {
        const target = e.target as HTMLInputElement | undefined;
        const file = target?.files?.[0];
        if (file) {
            this.createBase64Image(file);
            this.fileName = file.name;
        }
    }

    public setLanguage() {
        const settings = Object.assign({}, this.user?.settings);
        const language = this.selectedLanguage;
        if (language) {
            settings.languageKey = language.key;
            this.store.commit(SessionMutationTypes.SET_SETTINGS, settings);
        }
    }

    public setKey() {
        const settings = Object.assign({}, this.user?.settings);
        const key = this.selectedKey;
        if (key) {
            settings.defaultTransposition = key;
            this.store.commit(SessionMutationTypes.SET_SETTINGS, settings);
        }
    }

    public setTranscode() {
        const settings = Object.assign({}, this.user?.settings);
        const transcode = this.selectedTranscode;
        if (transcode) {
            settings.defaultTranscode = transcode;
            this.store.commit(SessionMutationTypes.SET_SETTINGS, settings);
        }
    }

    public get languages(): Language[] {
        return appSession.languages || [];
    }

    public get user(): User | undefined {
        return this.store.getters.user;
    }

    public async setDisplayName() {
        await this.store.dispatch(
            SessionActionTypes.SET_DISPLAY_NAME,
            this.newDisplayName,
        );
    }

    public async submitImage() {
        if (this.fileName && this.selectedImage) {
            await auth.setProfileImage(this.fileName, this.selectedImage);
        }
    }

    private async createBase64Image(file: File) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const res = e.target?.result;
            if (typeof res == "string") {
                this.selectedImage = res;
            }
        };
        reader.readAsDataURL(file);
    }
}
</script>
