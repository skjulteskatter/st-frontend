<template>
    <nav class="nav" v-if="user && initialized">
        <div class="nav__wrapper">
            <router-link class="nav__item" to="/dashboard">Dashboard</router-link>
            <router-link v-if="isAdmin" class="nav__item" to="/users">Users</router-link>
            <router-link class="nav__item" to="/song">Songs</router-link>
            <settings class="nav__item"></settings>
        </div>
    </nav>
    <div id="wrapper" v-if="user && initialized">
        <router-view/>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { useStore } from 'vuex';
import { sessionKey } from '../store';
import Settings from '@/components/Options.vue';
import themes from '@/classes/themes';

@Options({
    components: {
        Settings,
    }
})
export default class DashboardLayout extends Vue {
    mounted(){
        document.documentElement.style.setProperty('--primary-color', localStorage.getItem('theme_color') || '');
        themes.load();
    }

    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
    public get isAdmin() {
        return useStore(sessionKey).getters.isAdmin;
    }
    public get initialized() {
        return useStore(sessionKey).getters.initialized;
    }
}
</script>
<style lang="scss">

#wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--spacing);
    word-wrap: break-word;
}

select {
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
    padding: .5em;
}

button {
    padding: .5em;
    background: var(--primary-color);
    font-weight: bold;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;

    &[secondary] {
        background: var(--background-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        font-weight: 400;
    }
}

.nav {
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);

    display: flex;
    justify-content: center;

    &__wrapper {
        max-width: 1000px;
        width: 100%;
        padding: var(--spacing);

        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__item {
        color: var(--text-color);
        margin-left: var(--spacing);
        text-decoration: none;
        font-weight: bold;

        &.router-link-exact-active {
            color: var(--primary-color);
        }
    }
}
</style>