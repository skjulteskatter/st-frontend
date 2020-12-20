<template>
    <div id="nav">
        <router-link to="/about">About</router-link> | 
        <router-link to="/users">Users</router-link>
    </div>
    <div id="wrapper">
        <router-view/>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
})
export default class Home extends Vue {
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
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
}

#wrapper {
    width: 900px;
    margin: 0 auto;
    word-wrap: break-word;
}
</style>
