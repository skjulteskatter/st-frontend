<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
        <button @click="login">LOGIN</button>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import api from '@/services/api';

@Options({
    components: {
        HelloWorld,
    },
})
export default class Home extends Vue {
    async login() {
        await api.session.login();
    }
}
</script>
