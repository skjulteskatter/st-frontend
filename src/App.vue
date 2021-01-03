<template>
    <div id="nav">
        <router-link to="/about">About</router-link> | 
        <router-link to="/users">Users</router-link> |
        <router-link to="/song">Songs</router-link>
        <settings id="options"></settings>
    </div>
    <div id="wrapper">
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Settings from '@/components/Options.vue';
import songService from './services/songs';

@Options({
    components: {
        Settings
    }
})
export default class Home extends Vue {
    async mounted() {
        await songService.init();
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
    width: 900px;
    margin: 0 auto;
    word-wrap: break-word;
}

#options {
    float: right;
}

#wrapper {
    width: 900px;
    margin: 0 auto;
    word-wrap: break-word;
}
</style>
