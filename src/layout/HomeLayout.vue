<template class="home-layout">
    <nav class="nav">
        <div class="container nav__wrapper">
            <img id="logo" :src="logo" @click="$router.push('/')" />
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
import { sanityKey } from '@/store/sanity';

@Options({
    components: {
        Card,
        FooterComponent,
        LandingPage,
    }
})
export default class DashboardLayout extends Vue {

    public mounted() {
        useStore(sanityKey).dispatch('init');
    }

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
@import '@/style/main';

section {
    background: var(--background-color);
}

#logo {
    margin: 0 auto 0 0;
    max-height: 35px;
    cursor: pointer;
}
</style>