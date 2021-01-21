<template>
    <nav class="nav" v-if="user && initialized">
        <div class="container nav__wrapper">
            <a href="/" id="logo">
                <img :src="logo" />
            </a>
            <router-link class="nav__item" to="/dashboard">Dashboard</router-link>
            <router-link v-if="isAdmin" class="nav__item" to="/dashboard/users">Users</router-link>
            <router-link class="nav__item" to="/dashboard/songs">Songs</router-link>
            <router-link class="nav__item" to="/dashboard/store">Store</router-link>
            <settings class="nav__item"></settings>
        </div>
    </nav>
    <div class="container" v-if="user && initialized">
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
        document.documentElement.style.setProperty('--primary-color', localStorage.getItem('theme_color') || themes.default);
        themes.load();
    }

    public get logo(){
        // Return the direct url to the logo
        return 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.jpg'
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

#logo {
    margin: 0 auto 0 0;
    img {
        max-height: 35px;
    }
}

.tag {
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: var(--border-radius);
    padding: .5em;
    font-size: .7em;
    text-transform: uppercase;
    margin-right: calc(var(--spacing)/2);
    margin-bottom: var(--spacing);

    &.empty {
        border: 1px solid var(--text-color);
        color: var(--text-color);
        opacity: .6;
    }
}

select {
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
    padding: .5em;
}

input[type=text] {
    padding: var(--spacing);
    background: transparent;
    border: none;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
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
        max-width: 1200px;
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

.loader {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 9;
    position: fixed;
    top: 0;
    left: 0;

    &:after {
        content: '';
        width: 100px;
        height: 100px;

        border-radius: 100%;
        border-bottom: 10px solid var(--primary-color);
        border-top: 10px solid var(--primary-color);
        border-left: 10px solid var(--primary-color);
        border-right: 10px solid transparent;

        animation: loading 1s infinite linear;
    }

}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>