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
                <h2>User settings</h2>
                <div class="user-settings__color">
                    <label for="theme-color">Theme color</label>
                    <input id="theme-color" type="color" v-model="themeColor" @input="setThemeColor()">
                    <button @click="setThemeColor('#0073ff')" secondary>Reset</button>
                </div>
                <div class="user-settings__language">
                    <label for="language">Language</label>
                    <select id="language" name="language" v-model="settings.languageKey">
                        <option v-for="lang in languages" :value="lang.key" :key="lang.key">{{lang.name}}</option>
                    </select>
                </div>
                <button class="user-settings__save-button" @click="save">Save settings</button>
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
    public settings?: UserSettings;

    public token = localStorage.getItem("id_token");

    public mounted() {
        this.settings = this.user?.settings;
    }

    public setThemeColor(color?: string) {
        localStorage.setItem('theme_color', color ?? this.themeColor)
        document.documentElement.style.setProperty('--primary-color', color ?? this.themeColor)
    }

    public save() {
        useStore(sessionKey).dispatch('saveSettings', this.settings);
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

    &__color {

        input[type=color] {
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            background: var(--backround-color);
            margin-right: var(--spacing);
        }
    }

    div {
        label {
            display: block;
            margin-bottom: .2em;
        }
    }

    h2 {
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