<template>
    <base-card style="margin-bottom: var(--st-spacing)">
        <div class="user-settings">
            <h2 class="user-settings__title">{{ $t("common.settings") }}</h2>
            <div class="user-settings__fields gap-y">
                <div class="user-settings__theme field gap-x">
                    <label for="theme-mode">{{ $t("common.theme") }}</label>
                    <hr />
                    <select name="theme-mode" id="theme-mode" v-model="theme">
                        <option :value="t" v-for="t in themes.keys" :key="t">
                            {{ t }}
                        </option>
                    </select>
                </div>
                <div class="user-settings__color field gap-x">
                    <label for="theme-color">{{
                        `${$t("common.theme")} ${$t(
                            "common.color"
                        ).toLowerCase()}`
                    }}</label>
                    <hr />
                    <input
                        id="theme-color"
                        type="color"
                        v-model="themeColor"
                        @input="setThemeColor()"
                    />
                    <base-button
                        :action="
                            () => {
                                setThemeColor('#5372e2');
                            }
                        "
                        theme="secondary"
                        label="Reset"
                    ></base-button>
                </div>
                <div class="user-settings__language field gap-x">
                    <label for="language">{{ $t("common.language") }}</label>
                    <hr />
                    <select
                        id="language"
                        name="language"
                        v-model="selectedLanguage"
                        @input="setLanguage"
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
            </div>
            <base-button
                :loading="loadingSave"
                :label="$t('common.save')"
                :action="save"
                class="user-settings__save-button"
            ></base-button>
        </div>
    </base-card>
</template>

<script lang="ts">
import { sessionKey, usersKey } from "@/store";
import { useStore } from "vuex";
import { Options, Vue } from "vue-class-component";
import themes, { Themes } from "@/classes/themes";
import BaseButton from "@/components/BaseButton.vue";
import BaseCard from "@/components/BaseCard.vue";

@Options({
    components: {
        BaseButton,
        BaseCard,
    },
})
export default class SettingsCard extends Vue {
    public selectedLanguage: Language = {} as Language;
    public store = useStore(sessionKey);
    public themes: Themes = themes;

    public themeColor = localStorage.getItem("theme_color") ?? themes.default;
    public theme = localStorage.getItem("theme") ?? "dark";
    public token = localStorage.getItem("id_token");

    public loadingSave = false;

    public mounted() {
        this.selectedLanguage =
            this.languages.find(
                (l) => l.key == this.user.settings?.languageKey
            ) ??
            this.languages.find((l) => l.key == "no") ??
            ({} as Language);
    }

    public setThemeColor(color?: string) {
        this.themes.setThemeColor(color ?? this.themeColor);
    }

    public save() {
        this.loadingSave = true;
        setTimeout(() => {
            this.themes.setTheme(this.theme);
            this.store.dispatch("saveSettings", this.user.settings);
            this.loadingSave = false;
        }, 500);
    }

    public setLanguage() {
        setTimeout(() => {
            const settings = Object.assign({}, this.user.settings);
            const language = this.selectedLanguage;
            if (language) {
                settings.languageKey = language.key;
                this.store.commit("settings", settings);
            }
        }, 100);
    }

    public get languages(): Language[] {
        return useStore(sessionKey).getters.languages || [];
    }

    public get user(): User {
        return useStore(usersKey).getters.currentUser || {};
    }
}
</script>

<style lang="scss" scoped>
.user-settings {
    display: flex;
    flex-direction: column;
    // gap: calc(var(--st-spacing) * 0.5);

    &__fields {
        .field {
            display: flex;
            align-items: center;
            justify-content: space-between;
            // gap: calc(var(--st-spacing) * 0.5);
            padding: 0.5em 0;

            label {
                white-space: nowrap;
            }

            hr {
                border: none;
                border-top: 1px solid var(--st-border-color);
                width: 100%;
            }
        }
    }

    &__color {
        display: flex;
        // gap: var(--st-spacing);

        input[type="color"] {
            border-radius: var(--st-border-radius);
            border: 1px solid var(--st-border-color);
            height: 30px;
            background: var(--secondary-backround-color);

            &::-webkit-color-swatch {
                border-radius: var(--st-border-radius);
                border: none;
            }
        }
    }

    &__title {
        margin: 0;
    }

    &__save-button {
        align-self: flex-end;

        @media screen and (max-width: 600px) {
            align-self: initial;
        }
    }
}
</style>