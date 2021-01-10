<template>
    <div id="dashboard">
        <h1>Dashboard</h1>
        <card class="user-info" border>
            <div class="user-info__field">
                <label>Name</label>
                <h3>{{ user.displayName }}</h3>
            </div>
            <div class="user-info__field">
                <label>E-mail</label>
                <h3>{{ user.email }}</h3>
            </div>
        </card>

        <card style="margin-bottom: var(--spacing)">
            <div class="user-settings">
                <h2 class="user-settings__title">User settings</h2>
                <div class="user-settings__fields">
                    <div class="user-settings__color field">
                        <label for="theme-color">Theme color</label>
                        <input id="theme-color" type="color" v-model="themeColor" @input="setThemeColor()">
                        <button @click="setThemeColor('#0073ff')" secondary>Reset</button>
                    </div>
                    <div class="user-settings__language field">
                        <label for="language">Language</label>
                        <select id="language" name="language" v-model="selectedLanguage" @input="setLanguage">
                            <option v-for="lang in languages" :value="lang" :key="lang.key">{{lang.name}}</option>
                        </select>
                    </div>
                </div>
                <button class="user-settings__save-button" @click="save">Save</button>
            </div>
        </card>
        
        <card class="api-token">
            <h3>API token</h3>
            <button @click="showApiToken = true" class="api-token__button" secondary>Show API token</button>
            <p v-if="showApiToken" style="font-size: .8em">{{ token }}</p>
        </card>
    </div>
</template>

<script lang="ts">
import { sessionKey } from '@/store';
import { Options, Vue } from 'vue-class-component';
import { useStore } from 'vuex';
import Card from '@/components/Card.vue'

@Options({
    components: {
        Card,
    }
})
export default class Dashboard extends Vue {
    public showApiToken = false;
    public themeColor = localStorage.getItem('theme_color') ?? "";
    public selectedLanguage? = this.languages.find(l => l.key == this.user.settings?.languageKey) ?? this.languages.find(l => l.key == "no");
    public store = useStore(sessionKey);

    public token = localStorage.getItem("id_token");

    public setThemeColor(color?: string) {
        localStorage.setItem('theme_color', color ?? this.themeColor)
        document.documentElement.style.setProperty('--primary-color', color ?? this.themeColor)
    }

    public save() {
        this.store.dispatch('saveSettings', this.user.settings);
    }

    public setLanguage() {
        const settings = Object.assign({}, this.user.settings);
        if (this.selectedLanguage) {
            settings.languageKey = this.selectedLanguage.key;

            this.store.commit('settings', settings);
        }
    }

    public get languages(): Language[] {
        return useStore(sessionKey).getters.languages || [];
    }

    public get user(): User {
        return useStore(sessionKey).getters?.currentUser || {};
    }
}
</script>

<style lang="scss" scoped>
.user-info {
    margin-bottom: var(--spacing);

    h3 {
        margin: 0;
    }

    &__field {
        &:not(:last-child) {
            margin-bottom: var(--spacing);
        }

        & > label {
            opacity: .7;
        }
    }
}

.user-settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);

    &__fields {

        .field {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing);
            padding: .5em 0;

            &:not(:last-child) {
                border-bottom: 1px solid #eaeaea;
            }
        }
    }

    &__color {
        display: flex;
        gap: var(--spacing);

        label {
            display: block;
            width: 100%;
        }

        input[type=color] {
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            height: 30px;
            background: var(--backround-color);

            &::-webkit-color-swatch {
                border-radius: var(--border-radius);
                border: none;
            }
        }
    }

    #language {
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: .5em;
    }


    &__title {
        margin: 0;
    }
}

.api-token {
    h3 {
        margin: 0 var(--spacing) 0 0;
        display: inline-block;
    }
}
</style>