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
                <card v-for="post in posts" :key="post.title" :image="post.image" border>
                    <h2>{{ post.title }}</h2>
                    <b style="color: var(--primary-color); cursor: pointer" @click="openBlogPost(post.slug.current)">Read more</b>
                </card>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from '@/components/Card.vue';
import sanity, { Post, PostPreview } from "@/services/sanity";

@Options({
    components: {
        Card,
    }
})
export default class LandingPage extends Vue {
    public posts: PostPreview[] = [];

    public async mounted(){
        this.posts = await sanity.getAllPosts('no');
    }

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