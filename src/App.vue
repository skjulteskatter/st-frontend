<template>
    <div id="nav">
        <router-link to="/about">Dashboard</router-link> | 
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
:root {
    --primary-color: #0073ff;
    --text-color: #2c3e50;
}

*,
*:before,
*:after {
    box-sizing: border-box;
}

body {
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--text-color);
}

#nav {
    background-color: #eaeaea;
    padding: 2em;

    word-wrap: break-word;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}

#options {
    float: right;
}

#wrapper {
    max-width: 1000px;
    margin: 0 auto;
    word-wrap: break-word;
}
</style>
