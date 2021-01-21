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
            <h1>Newest</h1>
            <div class="posts__wrapper">
                <card v-for="post in posts" :key="post.title" image="https://source.unsplash.com/random" border>
                    <h2>{{ post.title }}</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus repudiandae veniam doloribus modi nisi. </p>
                    <b style="color: var(--primary-color); cursor: pointer" @click="openBlogPost(post.slug)">Read more</b>
                </card>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from '@/components/Card.vue';

@Options({
    components: {
        Card,
    }
})
export default class LandingPage extends Vue {
    public posts = [
        {title: 'Post 1', slug: 'post-1' },
        {title: 'Post 2', slug: 'post-2' },
        {title: 'Post 3', slug: 'post-3' }
    ];

    public openBlogPost(slug: string){
        this.$router.push(`/blog/${slug}`);
    }
}
</script>

<style lang="scss">

.posts__wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing);

    @media screen and (max-width: 600px) {
        grid-template-columns: 1fr;
    }
}

section {
    padding: calc(var(--spacing) * 2) 0;
    min-height: 75vh;
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