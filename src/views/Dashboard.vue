<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <base-card class="user-info" border>
            <div class="fields">
                <div class="user-info__field">
                    <span class="tag empty" v-if="!user.roles.length">no roles</span>
                    <span class="tag" v-for="role in user.roles" :key="'tag-'+role.name">{{role.name}}</span>
                </div>
                <div class="user-info__field">
                    <h2 class="user-info__name">{{ user.displayName }}</h2>
                    <p class="user-info__email">{{ user.email }}</p>
                </div>
            </div>
            <div class="user-info__subscriptions" v-if="subscriptions.length">
                <label>Subscriptions</label>
                <div class="user-info__subscriptions__cards">
                    <base-card v-for="sub in subscribedCollections" :key="sub" border>
                        <b>{{sub.key}}</b>
                    </base-card>
                </div>
            </div>
        </base-card>

        <base-card style="margin-bottom: var(--st-spacing)">
            <div class="user-settings">
                <h2 class="user-settings__title">User settings</h2>
                <div class="user-settings__fields">
                    <div class="user-settings__theme field">
                        <label for="">Theme mode</label>
                        <hr>
                        <select name="theme-mode" id="theme-mode" v-model="theme">
                            <option :value="t" v-for="t in themes.keys" :key="t">{{t}}</option>
                        </select>
                    </div>
                    <div class="user-settings__color field">
                        <label for="theme-color">Theme color</label>
                        <hr>
                        <input id="theme-color" type="color" v-model="themeColor" @input="setThemeColor()">
                        <button @click="setThemeColor('#5372e2')" secondary>Reset</button>
                    </div>
                    <div class="user-settings__language field">
                        <label for="language">Language</label>
                        <hr>
                        <select id="language" name="language" v-model="selectedLanguage" @input="setLanguage">
                            <option v-for="lang in languages" :value="lang" :key="lang.key">{{lang.name}}</option>
                        </select>
                    </div>
                </div>
                <button class="user-settings__save-button" @click="save">{{$t('common.save')}}</button>
            </div>
        </base-card>
        
        <base-card class="api-token" border secondary>
            <h3>API token</h3>
            <button @click="showApiToken = true" class="api-token__button" secondary>Show API token</button>
            <p v-if="showApiToken" style="font-size: .8em">{{ token }}</p>
        </base-card>
    </div>
</template>

<script lang="ts">
import { sessionKey } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import themes, { Themes } from '@/classes/themes';
import BaseCard from '@/components/BaseCard.vue'

@Options({
    components: {
        BaseCard,
    }
})
export default class Dashboard extends Vue {
    public showApiToken = false;
    public selectedLanguage: Language = {} as Language;
    public store = useStore(sessionKey);
    public themes: Themes = themes;

    public themeColor = localStorage.getItem('theme_color') ?? themes.default;
    public theme = localStorage.getItem('theme') ?? 'dark';
    public token = localStorage.getItem('id_token');

    public mounted() {
        this.selectedLanguage = this.languages.find(l => l.key == this.user.settings?.languageKey) ?? this.languages.find(l => l.key == "no") ?? {} as Language;
    }

    public setThemeColor(color?: string) {
        this.themes.setThemeColor(color ?? this.themeColor);
    }

    public save() {
        this.themes.setTheme(this.theme);
        this.store.dispatch('saveSettings', this.user.settings);
    }

    public setLanguage() {
        setTimeout(() => {
            const settings = Object.assign({}, this.user.settings);
            const language = this.selectedLanguage;
            if (language) {
                settings.languageKey = language.key;
                this.store.commit('settings', settings);
            }
        }, 100);
    }

    public get subscriptions(): Subscription[] {
        return useStore(sessionKey).state.currentUser.subscriptions ?? [];
    }

    public get subscribedCollections(){
        return this.store.getters.collections;
    }

    public get languages(): Language[] {
        return useStore(sessionKey).getters.languages || [];
    }

    public get user(): User {
        return useStore(sessionKey).getters?.currentUser || {};
    }
}
</script>

<style lang="scss">
.user-info {
    margin-bottom: var(--st-spacing);

    &__subscriptions {
        // border-left: 1px solid var(--st-primary-color);
        // padding-left: var(--st-spacing);

        &__cards {
            display: flex;
            gap: .5em;
            padding-top: .5em;
            max-height: 100px;
        }
    }

    .card__content {
        display: flex;
        flex-direction: column;
        gap: var(--st-spacing);
    }

    label {
        opacity: .6;
        font-size: .8em;
    }

    * {
        margin: 0;
    }

    &__name {
        margin-bottom: .2em;
    }

    &__field {
        &:not(:last-child) {
            margin-bottom: var(--st-spacing);
        }
    }
}

.user-settings {
    display: flex;
    flex-direction: column;
    gap: var(--st-spacing);

    &__fields {

        .field {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--st-spacing);
            padding: .5em 0;

            label {
                white-space: nowrap;
            }

            hr {
                border: none;
                border-top: 1px solid var(--st-border-color);
                width: 100%;
            }

            // &:not(:last-child) {
            //     // border-bottom: 1px solid var(--st-border-color);
            // }
        }
    }

    &__color {
        display: flex;
        gap: var(--st-spacing);

        input[type=color] {
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
}

.api-token {
    h3 {
        margin: 0 var(--st-spacing) 0 0;
        display: inline-block;
    }
}
</style>