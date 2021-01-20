<template>
    <nav class="nav">
        <div class="container nav__wrapper">
            <img :src="logo" id="logo" />
            <router-link v-if="!user.id" class="nav__item" to="/login">Login</router-link>
            <router-link v-else class="nav__item" to="/dashboard">Dashboard</router-link>
        </div>
    </nav>
    <header class="home__header">
        <div class="container">
            <div class="home__header__cta">
                <h3>Discover our</h3>
                <h1>SongTreasures</h1>
                <button>Read more</button>
            </div>
        </div>
    </header>
    <div class="container">
        <router-view/>
    </div>
    <footer class="home__footer">
        <div class="container">
            <small>Copyright 2021 © Stiftelsen Skjulte Skatters Forlag</small>
        </div>
    </footer>
</template>
<script lang="ts">
import { sessionKey } from '@/store';
import { Vue, Options } from 'vue-class-component';
import { useStore } from 'vuex';
import Card from '@/components/Card.vue';

@Options({
    components: {
        Card
    }
})
export default class DashboardLayout extends Vue {

    public get logo(){
        // Return the direct url to the logo
        return 'https://logosbynick.com/wp-content/uploads/2018/03/final-logo-example.png'
    }


    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
}
</script>
<style lang="scss">
:root {
    --primary-color: #5372e2;
    --border-color: #d0d0d0;
    --text-color: #333333;
    --background-color: #ffffff;
    --secondary-background-color: #fafafa;

    --border-radius: 5px;
    --spacing: 1rem;
}

#logo {
    max-height: 50px;
    margin: 0 auto 0 0;
}

.home {
    &__footer {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;

        background: var(--secondary-background-color);
        border-top: 1px solid var(--border-color);
        padding: var(--spacing);
    }

    &__header {
        width: 100%;
        min-height: 40vh;
        background-color: var(--primary-color);
        display: flex;
        justify-content: flex-start;
        align-items: center;

        &__cta {
            font-size: 2.2em;
            color: white;

            .card__content {
                padding: 2rem;
            }

            h3, h1 {
                margin: 0;
            }

            h3 {
                opacity: .7;
            }

            button {
                border: 1px solid white;
                transition: all .2s ease;
                font-size: 1.1rem;
                margin-top: var(--spacing);

                &:hover {
                    background: white;
                    color: var(--text-color);
                }
            }
        }
    }
}

.nav {
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);

    display: flex;
    justify-content: center;

    &__wrapper {
        padding: var(--spacing) 0;

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