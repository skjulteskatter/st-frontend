<template>
    <BaseCard v-if="user">
        <div class="grid md:grid-cols-2 gap-6" v-show="category == 'general'">
            <div class="relative">
                <label class="block uppercase text-xs tracking-wide mb-1" for="theme-mode">{{ $t('common_color') }}{{ $t("common_theme") }}</label>
                <select
                    class="pl-10 w-full rounded-md border border-black/20 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
                    name="theme-mode"
                    id="theme-mode"
                    v-model="theme"
                >
                    <option :value="t" v-for="t in themes.keys" :key="t">
                        {{ $t(`common_${t}`) }}
                    </option>
                </select>
                <ColorSwatchIcon class="opacity-50 w-4 h-4 absolute left-3 bottom-3" />
            </div>
            <div class="relative">
                <label class="block uppercase text-xs tracking-wide mb-1" for="language">{{ $t("common_language") }}</label>
                <select
                    class="pl-10 w-full rounded-md border border-black/20 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
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
                <label class="block uppercase text-xs tracking-wide mb-1" for="transposition-key">{{ $t("song_key") }}</label>
                <select
                    class="pl-10 w-full rounded-md border border-black/20 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
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
                <img :src="image" alt="Profile picture" class="rounded-full border border-black/20 dark:border-white/20" width="100" height="100">
                <div>
                    <h3 class="text-xl">{{ user.displayName }}</h3>
                    <div v-if="editEmail">
                        <div class="flex">
                            <BaseInput type="email" :placeholder="user.email"  v-model="editEmailValue" />
                            <BaseButton @click="updateEmail()">{{ $t("common_confirm") }}</BaseButton>
                        </div>
                        <p v-if="editEmailError" class="text-red-500">{{ editEmailError }}</p>
                    </div>
                    <p v-else class="text-sm mb-2 text-gray-500">{{ user.email }} <span class="cursor-pointer text-blue-500" @click="editEmail = true">{{ $t("common_edit").toLowerCase() }}</span></p>
                    <span v-if="user.roles.length" :class="[user.roles[0] == 'administrator' ? 'bg-green-500/20 text-green-600 dark:bg-green-200/20 dark:text-green-200' : 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-200/20 dark:text-yellow-300', 'rounded-full text-xs tracking-wide py-1 px-2 mt-1']">{{ user.roles[0] }}</span>
                    <span v-else class="bg-black/5 text-gray-500 dark:bg-white/10 dark:text-white rounded-full text-xs tracking-wide py-1 px-2 mt-1">Standard</span>
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block uppercase tracking-wide text-xs mb-1" for="display-name">{{ $t("common_name") }}</label>
                    <input
                        class="w-full rounded-md border border-black/20 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
                        id="display-name"
                        type="text"
                        v-model="newDisplayName"
                        :placeholder="user.displayName"
                    />
                </div>
                <!-- <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md dark:bg-opacity-10">
                    <label for="gender">{{ $t("common_gender") }}</label>
                    <select
                        class="rounded-mdborder border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 dark:bg-secondary"
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
                    <label for="birthDay">{{ $t("common_birthDay") }}</label>
                    <input type="date" v-model="birthDay" class="bg-transparent rounded-md border-black/20" />
                </div> -->
                <label>
                    <span class="block text-xs uppercase tracking-wide mb-1">{{ $t("common_image") }}</span>
                    <div class="flex gap-2 items-center py-2 px-3 rounded-md border border-black/20 dark:border-white/20">
                        <PhotographIcon class="opacity-50 w-4 h-4" />
                        {{ $t('common_change') }}
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
                    <label class="block text-xs uppercase tracking-wide mb-1">{{ $t("common_password") }}</label>
                    <ChangePassword />
                </div>
            </div>
            <div class="mt-6" v-if="collections.length">
                <span class="block text-xs uppercase tracking-wide mb-1">{{`${$t('common_my')} ${$t('common_subscriptions').toLowerCase()}`}}</span>
                <table class="flex flex-col rounded-md border border-black/20 dark:border-white/20">
                    <tr class="px-3 py-2" :class="{ 'bg-black/5 dark:bg-white/5': i % 2 == 1 }" v-for="(col, i) in collections" :key="col.id">{{col.getName()}}</tr>
                </table>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-4">
                <BaseButton
                    v-if="category == 'user' && collections.length"
                    @click="portal"
                    :loading="loading['subscriptions']"
                    theme="tertiary"
                >
                    <template #icon>
                        <CreditCardIcon class="w-4 h-4" />
                    </template>
                    {{ $t("common_manage") }}
                    {{ $t("common_subscriptions").toLowerCase() }}
                </BaseButton>
                <BaseButton
                    :loading="loading['save']"
                    @click="save"
                    theme="secondary"
                >
                    <template #icon>
                        <CheckIcon class="w-4 h-4" />
                    </template>
                    {{ $t("common_save") }}
                </BaseButton>
            </div>
        </template>
    </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import themes from "@/classes/themes";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { cache } from "@/services/cache";
import { ChangePassword } from "@/components/settings";
import { 
    CheckIcon,
    ColorSwatchIcon,
    TranslateIcon,
    MusicNoteIcon,
    PhotographIcon,
    CreditCardIcon,
} from "@heroicons/vue/solid";
import { notify } from "@/services/notify";
import { appSession } from "@/services/session";
import { session } from "@/services/api";
import { storeService } from "@/services/modules";
import { Language } from "songtreasures";
import { ensureLanguageIsFetched } from "@/i18n";
import { BaseInput } from "./inputs";
import { updateEmail, getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default defineComponent({
    name: "settings-card",
    components: {
    ChangePassword,
    CheckIcon,
    ColorSwatchIcon,
    TranslateIcon,
    MusicNoteIcon,
    PhotographIcon,
    CreditCardIcon,
    BaseInput
},
    props: {
        category: {
            type: String,
        },
    },
    data: () => ({
        store: useStore(),
        cache: cache,
        selectedLanguage: {} as Language,
        selectedKey: "",
        selectedTranscode: "",
        selectedImage: "",
        editEmail: false,
        editEmailValue: "",
        editEmailError: "",
        themes: themes,
        newDisplayName: "",
        offline: false,
        gender: "unknown" as "male" | "female" | "unknown",
        birthDay: "",
        theme: appSession.user.settings.theme,
        transpositions: [
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
        ],
        transcodes: [
            "common",
            "dutch",
            "german",
            "latin",
            "solfege",
            "scandinavian",
            "nashville",
            "roman",
        ],
        fileName: "",
        loading: {} as {
            [key: string]: boolean;
        },

    }),
    computed: {
        image() {
            return this.user?.image ?? "/img/portrait-placeholder.png";
        },
        initDate() {
            return this.user?.birthDay ? new Date(this.user.birthDay) : new Date();
        },
        token() {
            return localStorage.getItem("id_token");
        },
        languages(): Language[] {
            return appSession.languages || [];
        },
        user() {
            return appSession.user;
        },
        collections() {
            const colIds = this.user.subscriptions.reduce((a, b) => a.concat(b.collectionIds), [] as string[]) ?? [];
            return appSession.collections.filter(i => colIds.includes(i.id));
        },
    },
    async mounted() {
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
    },
    methods: {
        dateToString(date: Date) {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        },
        async save() {
            this.loading["save"] = true;
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
            this.themes.setTheme(this.theme);
            await this.user.saveSettings();
            await ensureLanguageIsFetched();
            this.submitImage();
            if (this.newDisplayName) {
                this.setDisplayName();
            }

            // Fire a success notification
            notify("success", this.$t("notification_saved"), "check", undefined, undefined, undefined, false);
            this.loading["save"] = false;
        },
        setOffline() {
            cache.set("config", "offline", this.offline);
        },
        handleImage(e: Event) {
            const target = e.target as HTMLInputElement | undefined;
            const file = target?.files?.[0];
            if (file) {
                this.createBase64Image(file);
                this.fileName = file.name;
            }
        },
        setLanguage() {
            const settings = this.user.settings;
            const language = this.selectedLanguage;
            if (language) {
                settings.languageKey = language.key;
            }
        },
        setKey() {
            const settings = this.user.settings;
            const key = this.selectedKey;
            if (key) {
                settings.defaultTransposition = key;
            }
        },
        setTranscode() {
            const settings = this.user.settings;
            const transcode = this.selectedTranscode;
            if (transcode) {
                settings.defaultTranscode = transcode;
            }
        },
        async setDisplayName() {
            await auth.setDisplayName(this.newDisplayName);
        },
        async submitImage() {
            if (this.fileName && this.selectedImage) {
                await auth.setProfileImage(this.fileName, this.selectedImage);
            }
        },
        async updateEmail() {
            this.editEmailError = ""
            const user = getAuth().currentUser
            if (user) {
                try {
                    await updateEmail(user, this.editEmailValue)
                } catch (e: any) {
                    const fe = e as FirebaseError
                    if (fe.code === "auth/requires-recent-login") {
                        if (confirm("You must be recently logged in to complete this action")) {
                            await auth.logout()
                        }
                    } else {
                        this.editEmailError = fe.code
                    }
                }
            }
        },
        async createBase64Image(file: File) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const res = e.target?.result;
                if (typeof res == "string") {
                    this.selectedImage = res;
                }
            };
            reader.readAsDataURL(file);
        },
        async portal() {
            this.loading["subscriptions"] = true;
            await storeService.portal().then((result) => {
                window.location = (result as unknown) as Location;
            });
            // this.loading["subscriptions"] = false;
        },
    },
});
</script>
