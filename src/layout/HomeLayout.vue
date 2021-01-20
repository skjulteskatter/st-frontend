<template>
    <nav class="nav">
        <div class="nav__wrapper">
            <router-link v-if="!user.id" class="nav__item" to="/login">Login</router-link>
            <router-link v-else class="nav__item" to="/dashboard">Dashboard</router-link>
        </div>
    </nav>
    <div id="wrapper">
        <h1>Welcome to SongTreasures!</h1>
        <router-view/>
    </div>
</template>
<script lang="ts">
import { sessionKey } from '@/store';
import { Vue, Options } from 'vue-class-component';
import { useStore } from 'vuex';

@Options({
})
export default class DashboardLayout extends Vue {


    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
}
</script>
<style lang="scss">

.tag {
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: var(--border-radius);
    padding: .5em;
    font-size: .7em;
    text-transform: uppercase;
    margin-right: calc(var(--spacing)/2);
    margin-bottom: var(--spacing);

    &.empty {
        border: 1px solid var(--text-color);
        color: var(--text-color); 
        opacity: .6;
    }
}

#wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--spacing);
    word-wrap: break-word;
}

select {
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
    padding: .5em;
}

input[type=text] {
    padding: var(--spacing);
    background: transparent;
    border: none;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
}

button {
    padding: .5em;
    background: var(--primary-color);
    font-weight: bold;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;

    &[secondary] {
        background: var(--background-color);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        font-weight: 400;
    }
}

.nav {
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);

    display: flex;
    justify-content: center;

    &__wrapper {
        max-width: 1000px;
        width: 100%;
        padding: var(--spacing);

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