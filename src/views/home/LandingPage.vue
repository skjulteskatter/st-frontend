<template>
    <header class="home__header">
        <div class="container">
            <div class="home__header__cta">
                <h3>Discover our</h3>
                <h1>Song treasures</h1>
                <a href="#about" class="cta">Read more</a>
            </div>
        </div>
    </header>
    <section id="blogposts">
        <div class="container">
            <post-slider></post-slider>
        </div>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import sanity, { PostPreview } from "@/services/sanity";
import Card from '@/components/Card.vue';
import PostCard from '@/components/home/PostCard.vue';
import PostSlider from '@/components/home/PostSlider.vue';

@Options({
    components: {
        Card,
        PostCard,
        PostSlider,
    }
})
export default class LandingPage extends Vue {
    
}
</script>

<style lang="scss">

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