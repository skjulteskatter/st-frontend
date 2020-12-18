<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
        <button @click="login">LOGIN</button>
        <div>{{ user }}</div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { Store, useStore } from 'vuex';
import { key, Session } from '@/store';

@Options({
    components: {
        HelloWorld,
    },
})
export default class Dashboard extends Vue {
    session: Store<Session> = useStore(key);
    user?: User;

    async login() {
        // await this.session.dispatch('login');
        // this.user = this.session.getters.currentUser;
    }
}
</script>
