<template>
    <base-card v-if="user">
        <div class="grid md:grid-cols-2 gap-6" v-show="category == 'general'">
            <div class="relative">
                <label class="block uppercase text-xs tracking-wide mb-1" for="theme-mode">{{ $t('common.color') }}{{ $t("common.theme") }}</label>
                <select
                    class="pl-10 w-full rounded-md border border-black/20 dark:border-white/20 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                    name="theme-mode"
                    id="theme-mode"
                    v-model="theme"
                    @change="themes.setTheme(theme)"
                >
                    <option :value="t" v-for="t in themes.keys" :key="t">
                        {{ $t(`common.${t}`) }}
                    </option>
                </select>
                <ColorSwatchIcon class="opacity-50 w-4 h-4 absolute left-3 bottom-3" />
            </div>
            <div class="relative">
                <label class="block uppercase text-xs tracking-wide mb-1" for="language">{{ $t("common.language") }}</label>
                <select
                    class="pl-10 w-full rounded-md border border-black/20 dark:border-white/20 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
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
                <TranslateIcon class="opacity-50 w-4 h-4 absolute bottom-3 left-3" />
            </div>
            <div class="relative">
                <label class="block uppercase text-xs tracking-wide mb-1" for="transposition-key">{{ $t("song.key") }}</label>
                <select
                    class="pl-10 w-full rounded-md border border-black/20 border-white/20 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                    id="transposition-key"
                    name="transposition-key"
                    v-model="selectedKey"
                    @change="setKey"
                >
                    <option v-for="k in transpositions" :value="k" :key="k">
                        {{ k }}
                    </option>
                </select>
                <MusicNoteIcon class="opacity-50 w-4 h-4 absolute bottom-3 left-3" />
            </div>
        </div>
        <div class="flex flex-col gap-2" v-show="category == 'user'">
            <div class="flex gap-6 items-center p-4">
                <img :src="image" alt="Profile picture" class="rounded-full">
                <div>
                    <h3 class="text-xl">{{ user.displayName }}</h3>
                    <span :class="[user.roles[0] == 'administrator' ? 'bg-green-500/20 text-green-600 dark:bg-green-200/20 dark:text-green-200' : 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-200/20 dark:text-yellow-300', 'rounded-full text-xs tracking-wide py-1 px-2 mt-1']">{{ user.roles[0] }}</span>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block uppercase tracking-wide text-xs mb-1" for="display-name">{{ $t("common.name") }}</label>
                    <input
                        class="w-full rounded-md border border-black/20 border-white/20 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
                        id="display-name"
                        type="text"
                        v-model="newDisplayName"
                        :placeholder="user.displayName"
                    />
                </div>
                <!-- <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                    <label for="gender">{{ $t("common.gender") }}</label>
                    <select
                        class="rounded-mdborder border-black/20 focus:outline-none focus:ring focus:ring-primary ring-offset-2 dark:bg-secondary"
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
                    <input type="date" v-model="birthDay" class="bg-transparent rounded-md border-black/20" />
                </div> -->
                <label>
                    <span class="block text-xs uppercase tracking-wide mb-1">{{ $t("common.image") }}</span>
                    <div class="flex gap-2 items-center py-2 px-3 rounded-md border border-black/20 dark:border-white/20">
                        <PhotographIcon class="opacity-50 w-4 h-4" />
                        {{ $t('common.change') }}
                    </div>
                    <input
                        class="hidden"
                        id="image"
                        type="file"
                        accept="image/*"
                        @change="handleImage"
                    />
                </label>
                <div>
                    <label class="block text-xs uppercase tracking-wide mb-1">{{ $t("common.password") }}</label>
                    <change-password />
                </div>
            </div>
        </div>
        <template #footer>
            <base-button
                :loading="loading"
                @click="save"
                theme="secondary"
                class="ml-auto"
            >
                <template #icon>
                    <CheckIcon class="w-4 h-4" />
                </template>
                {{ $t("common.save") }}
            </base-button>
        </template>
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
import { 
    CheckIcon,
    ColorSwatchIcon,
    TranslateIcon,
    MusicNoteIcon,
    PhotographIcon,
} from "@heroicons/vue/solid";
import { notify } from "@/services/notify";
import { appSession } from "@/services/session";
import { session } from "@/services/api";

@Options({
    components: {
        ChangePassword,
        CheckIcon,
        ColorSwatchIcon,
        TranslateIcon,
        MusicNoteIcon,
        PhotographIcon,
    },
    props: {
        category: {
            type: String,
        },
    },
    name: "settings-card",
})
export default class SettingsCard extends Vue {
    public category?: string;
    public cache = cache;
    public selectedLanguage: Language = {} as Language;
    public selectedKey = "";
    public selectedTranscode = "";
    public store = useStore();
    public themes: Themes = themes;
    public newDisplayName = "";
    public offline = false;
    public gender: "male" | "female" | "unknown" = "unknown";
    public birthDay = "";

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

    public get image() {
        return this.user?.image ?? "/img/portrait-placeholder.png";
    }

    private get initDate() {
        return this.user?.birthDay ? new Date(this.user.birthDay) : new Date();
    }

    private dateToString(date: Date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
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
        this.birthDay = this.user?.birthDay ? this.dateToString(new Date(this.user.birthDay)) : this.dateToString(this.initDate);
        
        this.offline = await cache.get("config", "offline") == true;
    }

    public async save() {
        this.loading = true;
        try {
            const gender = this.gender != this.user?.gender ? this.gender : undefined;
            const birthDay = this.birthDay != this.dateToString(this.initDate) ? this.birthDay : undefined;

            if (this.user && gender || birthDay) {
                await session.saveProfile({
                    gender,
                    birthDay,
                });

                if (this.user) {
                    if (gender)
                        this.user.gender = gender;
                    
                    if (birthDay)
                        this.user.birthDay = birthDay;
                }
            }
        }
        catch {
            //
        }
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
