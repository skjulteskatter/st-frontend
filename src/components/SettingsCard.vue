<template>
    <base-card class="user-settings" v-if="user" style="margin-bottom: var(--st-spacing)">
        <div class="user-settings__fields gap-y">
            <h3 class="user-settings__title">
                {{ $t("settings.general") }}
            </h3>
            <div class="user-settings__theme field gap-x">
                <label for="theme-mode">{{ $t("common.theme") }}</label>
                <hr />
                <select name="theme-mode" id="theme-mode" v-model="theme" @change="themes.setTheme(theme)">
                    <option :value="t" v-for="t in themes.keys" :key="t">
                        {{ t }}
                    </option>
                </select>
            </div>
            <div class="user-settings__language field gap-x">
                <label for="language">{{ $t("common.language") }}</label>
                <hr />
                <select
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
            <div class="user-settings__key field gap-x">
                <label for="transposition-key">{{ $t("song.key") }}</label>
                <hr />
                <select
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
            <!-- <div class="user-settings__key field gap-x">
                <label for="transcode">{{ $t("song.transcode") }}</label>
                <hr />
                <select
                    id="transcode"
                    name="transcode"
                    v-model="selectedTranscode"
                    @change="setTranscode"
                >
                    <option v-for="k in transcodes" :value="k" :key="k">
                        {{ k }}
                    </option>
                </select>
            </div> -->
        </div>
        <div class="user-settings__fields gap-y">
            <h3 class="user-settings__title">
                {{ $t("common.user") }}
            </h3>
            <div class="user-settings__name field gap-x">
                <label for="display-name">{{ $t("common.name") }}</label>
                <hr />
                <input
                    id="display-name"
                    type="text"
                    v-model="newDisplayName"
                    :placeholder="user.displayName"
                />
            </div>
            <div class="user-settings__image field gap-x">
                <label for="image">{{ $t("common.image") }}</label>
                <hr />
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    @change="handleImage"
                />
            </div>
        </div>
        <base-button
            :loading="loading"
            @click="save"
            icon="check"
            class="user-settings__save-button"
        >
            <span>
                <span>{{ $t("common.save") }}</span>
            </span>
        </base-button>
    </base-card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import themes, { Themes } from "@/classes/themes";
import { BaseButton, BaseCard } from "@/components";
import { Icon } from "@/components/icon";
import auth from "@/services/auth";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { NotificationActionTypes } from "@/store/modules/notifications/action-types";

@Options({
    components: {
        BaseButton,
        BaseCard,
        Icon,
    },
    name: "settings-card",
})
export default class SettingsCard extends Vue {
    public selectedLanguage: Language = {} as Language;
    public selectedKey = "";
    public selectedTranscode = "";
    public store = useStore();
    public themes: Themes = themes;
    public newDisplayName = "";
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

    public fileName = "";
    private selectedImage?: string;

    public theme = localStorage.getItem("theme") ?? "dark";
    public token = localStorage.getItem("id_token");

    public loading = false;

    public mounted() {
        this.selectedLanguage =
            this.languages.find(
                (l) => l.key == this.user?.settings?.languageKey,
            ) ??
            this.languages.find((l) => l.key == "no") ??
            ({} as Language);

        this.selectedKey = this.user?.settings?.defaultTransposition ?? "C";

        this.selectedTranscode = this.user?.settings?.defaultTranscode ?? "common";
    }

    public async save() {
        this.loading = true;
        await this.store.dispatch(SessionActionTypes.SESSION_SAVE_SETTINGS);
        this.themes.setTheme(this.theme);
        this.submitImage();
        if (this.newDisplayName) {
            this.setDisplayName();
        }

        // Fire a success notification
        this.store.dispatch(NotificationActionTypes.ADD_NOTIFICATION, {
            type: "success",
            title: this.$t("notification.saved"),
            icon: "check",
        });
        this.loading = false;
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
        return this.store.state.session.languages || [];
    }

    public get user(): User | undefined {
        return this.store.getters.user;
    }

    public async setDisplayName() {
        await this.store.dispatch(SessionActionTypes.SET_DISPLAY_NAME, this.newDisplayName);
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

<style lang="scss" scoped>
@import "../style/mixins";

.user-settings {
    display: flex;
    flex-direction: column;
    gap: var(--st-spacing);
    max-width: 1200px;

    &__fields {
        .field {
            display: flex;
            align-items: center;
            justify-content: space-between;

            label {
                white-space: nowrap;
            }

            hr {
                border: none;
                border-top: 1px solid var(--st-color-border);
                width: 100%;
            }
        }
    }

    &__color {
        display: flex;

        input[type="color"] {
            border-radius: var(--st-border-radius);
            border: 1px solid var(--st-color-border);
            height: 30px;
            background: var(--secondary-backround-color);

            &::-webkit-color-swatch {
                border-radius: var(--st-border-radius);
                border: none;
            }
        }
    }

    &__title {
        margin: 0 0 var(--st-spacing) 0;
    }

    &__save-button {
        align-self: flex-end;
        margin-top: var(--st-spacing);

        @include breakpoint("small") {
            align-self: initial;
        }
    }
}
</style>
