<template>
    <nav class="nav">
        <div class="container nav__wrapper">
            <a href="/" id="logo">
                <img :src="logo" />
            </a>
            <router-link v-if="!user.id" class="nav__item" to="/login">Login</router-link>
            <router-link v-else class="nav__item" to="/dashboard">Dashboard</router-link>
        </div>
    </nav>
    <router-view/>
    <footer-component></footer-component>
</template>
<script lang="ts">
import { sessionKey } from '@/store';
import { Vue, Options } from 'vue-class-component';
import { useStore } from 'vuex';

import Card from '@/components/Card.vue';
import FooterComponent from '@/components/home/FooterComponent.vue';
import LandingPage from '@/views/home/LandingPage.vue';

@Options({
    components: {
        Card,
        FooterComponent,
        LandingPage,
    }
})
export default class DashboardLayout extends Vue {

    public get logo(){
        // Return the direct url to the logo
        return 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.jpg'
    }


    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
}
</script>
<style lang="scss">

body {
    background: var(--background-color);
}

#logo {
    margin: 0 auto 0 0;

    img {
        max-height: 35px;
    }
}

.nav {
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);

    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 1;

    &__wrapper {
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