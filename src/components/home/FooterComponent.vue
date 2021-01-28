<template>
    <footer class="footer">
        <div class="container footer__content">
            <div class="footer__content-group">
                <b class="footer__content-group__title">Links</b>
                <router-link to="/" class="footer__content-group__link">Home</router-link>
                <router-link to="/blog" class="footer__content-group__link">Blog</router-link>
            </div>
            <div class="footer__content-group">
                <b class="footer__content-group__title">Contact</b>
                <router-link to="/contact" class="footer__content-group__link">Get in touch</router-link>
            </div>
            <div class="footer__content-group">
                <b class="footer__content-group__title">Get the app</b>
                <img src="/img/app_store_badge.png">
                <img src="/img/play_store_badge.png">
            </div>
        </div>
        <div class="footer__copyright">
            <div class="container">
                <small>Copyright 2021 © Stiftelsen Skjulte Skatters Forlag</small>
            </div>
        </div>
    </footer>
</template>

<script>
import { Vue } from "vue-class-component";

export default class FooterComponent extends Vue {
    
}
</script>

<style lang="scss">
.footer {
    width: 100%;

    background: var(--st-secondary-background-color);
    border-top: 1px solid var(--st-border-color);

    &__copyright {
        background: rgba(black, .1);
    }

    &__content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--st-spacing);

        &-group {
            display: flex;
            flex-direction: column;
            gap: .5em;

            &__title {
                margin-bottom: var(--st-spacing);
            }

            &__link {
                color: var(--st-text-color);
                text-decoration: none;
            }

            img {
                max-width: 150px;
            }
        }
    }
}
</style>