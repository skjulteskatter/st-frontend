<template>
    <nav class="nav" v-if="user && initialized">
        <div class="container nav__wrapper">
            <img id="logo" :src="logo" @click="$router.push('/')"/>
            <router-link class="nav__item" :to="{name: 'main'}">{{$t('common.dashboard')}}</router-link>
            <router-link class="nav__item" :to="{name: 'collections'}">{{$t('common.songs')}}</router-link>
            <router-link class="nav__item" :to="{name: 'store'}">{{$t('common.store')}}</router-link>
            <router-link v-if="isAdmin" class="nav__item" :to="{name: 'admin'}">Admin</router-link>
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
    max-height: 35px;
    cursor: pointer;
}
</style>