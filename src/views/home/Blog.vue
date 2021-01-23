<template>
    <section>
        <div class="container">
            <h1>All posts</h1>
            <div id="post-wrapper">
                <post-card v-for="post in posts" :key="post.title" :title="post.title" :image="post.image" :slug="post.slug.current"></post-card>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import sanity, { PostPreview } from "@/services/sanity";
import { Options, Vue } from "vue-class-component";
import PostCard from '@/components/home/PostCard.vue';

@Options({
    components: {
        PostCard,
    }
})
export default class Blog extends Vue {
    public posts: PostPreview[] = [];

    public async mounted(){
        this.posts = await sanity.getAllPosts('no');
    }
}
</script>

<style lang="scss">
#post-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing);

    @media screen and (max-width: 600px) {
        grid-template-columns: 1fr;
    }
}
</style>