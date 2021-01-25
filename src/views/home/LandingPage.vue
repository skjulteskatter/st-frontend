<template>
    <header class="home__header">
        <div class="container slideIn">
            <div class="home__header__cta">
                <h3>Discover our</h3>
                <h1>Song treasures</h1>
                <router-link to="/register" class="cta">Start now</router-link>
            </div>
        </div>
    </header>
    <section id="about">
        <div class="container">
            <h1>What is SongTreasures?</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda esse illum incidunt hic eaque odit, ex voluptates mollitia qui provident nam impedit alias doloribus. Eligendi blanditiis adipisci modi iure id.
            Ullam, voluptate! Dolorum eius, quas quia harum quis soluta voluptatibus aliquam molestiae temporibus nostrum doloribus iste tempora odit quo adipisci veritatis, sed ipsum optio quidem dolor laborum praesentium voluptate. Nemo.
            Explicabo, nulla blanditiis! Impedit, fugit sit atque aspernatur eos tempora minus eveniet praesentium expedita exercitationem dolore culpa molestias provident inventore quaerat a magni est nobis! Sed enim inventore eligendi laboriosam.</p>
        </div>
    </section>
    <section id="blogposts">
        <div class="container">
            <post-slider></post-slider>
        </div>
    </section>
    <section id="contact">
        <div class="container">
            <div class="contact__cta">
                <h1>Get in touch with us.</h1>
                <p>We will gladly answer any of your questions</p>
            </div>
            <card>
                <contact-form></contact-form>
            </card>
        </div>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from '@/components/Card.vue';
import PostCard from '@/components/home/PostCard.vue';
import PostSlider from '@/components/home/PostSlider.vue';
import ContactForm from '@/components/home/ContactForm.vue';

@Options({
    components: {
        Card,
        PostCard,
        PostSlider,
        ContactForm,
    }
})
export default class LandingPage extends Vue {
    
}
</script>

<style lang="scss">

#contact {
    background: var(--primary-color);

    .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing);

        @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    }

    .contact__cta {
        color: white;
        font-size: 2em;

        display: flex;
        flex-direction: column;
        justify-content: center;

        @media screen and (max-width: 600px) {
            font-size: 1.5em;
            text-align: center;
        }

        p {
            opacity: .8;
        }

        h1, p {
            margin: 0 0 .3em 0;
        }
    }
}

.home {
    &__header {
        width: 100%;
        min-height: 30vh;
        background-color: var(--primary-color);

        display: flex;
        justify-content: center;
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
</style>