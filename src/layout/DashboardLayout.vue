<template>
    <the-navbar v-if="user && initialized"></the-navbar>
    <div class="container" v-if="user && initialized">
        <router-view/>
    </div>
</template>
<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { useStore } from 'vuex';
import { sessionKey } from '../store';
import themes from '@/classes/themes';
import TheNavbar from '@/components/TheNavbar.vue';

@Options({
    components: {
        TheNavbar
    }
})
export default class DashboardLayout extends Vue {
    mounted(){
        document.documentElement.style.setProperty('--st-primary-color', localStorage.getItem('theme_color') || themes.default);
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
<style lang="scss"></style>