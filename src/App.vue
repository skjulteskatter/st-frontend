<template>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <button @click="login()">LOGIN</button>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorld from './components/HelloWorld.vue'
import api from './services/api'

@Options({
    components: {
        HelloWorld
    }
})
export default class App extends Vue {
    public player: User = {} as User

    public async login () {
        await api.session.login()
    }

    public async mounted () {
        if (api.session.isAuthenticated) {
            this.player = await api.session.getCurrentUser()
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
