<template>
    <nav class="nav">
        <div class="container nav__wrapper">
            <a href="/" id="logo">
                <img :src="logo" />
            </a>
            <router-link v-if="!user.id" class="nav__item" to="/login">Login</router-link>
            <router-link v-else class="nav__item" to="/dashboard">Dashboard</router-link>
        </div>
    </nav>
    <header class="home__header">
        <div class="container">
            <div class="home__header__cta">
                <h3>Discover our</h3>
                <h1>Song treasures</h1>
                <a href="#about" class="cta">Read more</a>
            </div>
        </div>
    </header>
    <div class="container">
        <router-view/>
    </div>
    <footer-component></footer-component>
</template>
<script lang="ts">
import { sessionKey } from '@/store';
import { Vue, Options } from 'vue-class-component';
import { useStore } from 'vuex';
import Card from '@/components/Card.vue';
import FooterComponent from '@/components/FooterComponent.vue';

@Options({
    components: {
        Card,
        FooterComponent,
    }
})
export default class DashboardLayout extends Vue {

    public get logo(){
        // Return the direct url to the logo
        return 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo3.jpg'
    }


    public get user() {
        return useStore(sessionKey).state.currentUser;
    }
}
</script>
<style lang="scss">

#logo {
    margin: 0 auto 0 0;
    img {
        max-height: 35px;
    }
}

.home {

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

            h3, h1 {
                margin: 0;
            }

            h3 {
                opacity: .7;
            }

            .cta {
                font-size: 1.2rem;
                text-decoration: none;
                color: white;
                font-weight: bold;
                position: relative;


                &:after {
                    content: '';
                    height: 3px;
                    width: 0;
                    background: white;
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    transition: all .2s ease;
                }

                &:hover {
                    &:after {
                        width: 100%;
                    }
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