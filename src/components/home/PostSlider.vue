<template>
    <div class="post-slider__header">
        <h1>Newest</h1>
        <router-link class="see-more" to="/blog">See all</router-link>
    </div>
    <div class="post-slider__posts">
        <post-card v-for="post in posts" :key="post.title" :image="post.image" :title="post.title" :slug="post.slug.current"></post-card>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import sanity, { PostPreview } from "@/services/sanity";
import PostCard from '@/components/home/PostCard.vue';

@Options({
    components: {
        PostCard,
    }
})
export default class PostSlider extends Vue {
    public posts: PostPreview[] = [];

    public async mounted(){
        this.posts = await sanity.getAllPosts('no');
    }
}
</script>

<style lang="scss" scoped>

.post-slider {
    &__header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .see-more {
            color: var(--text-color);
            font-weight: bold;
        }
    }

    &__posts {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing);

        @media screen and (max-width: 600px) {
            grid-template-columns: 1fr;
        }
    }
}

</style>