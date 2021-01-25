<template>
    <div class="container post slideIn">
        <div class="post__header-image" :style="{'backgroundImage': `url(${post.image})`}"></div>
        <div class="post__content">
            <h1 class="post__content__title">{{ post.title }}</h1>
            <div class="post__content__body" v-if="body" v-html="body"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from '@/components/Card.vue';
import sanity, { Post } from "@/services/sanity";

@Options({
    components: {
        Card,
    }
})
export default class BlogPost extends Vue {
    public currentPost: Post = {} as Post;
    public body = undefined;

    public async mounted(){
        const res = await sanity.getPost(this.$route.params.post as string, 'no');
        this.currentPost = res.post;
        this.body = res.body;
    }

    public get post(){
        return this.currentPost;
    }
}
</script>

<style lang="scss" scoped>
.post {
    padding-top: 0;

    &__content {

        &__title {
            font-size: 2.5em;
        }

        &__body {
            img {
                max-width: 500px;
            } 
        }
    }

    &__header-image {
        height: 50vh;

        background-size: cover;
        background-position: center;
    }

}

</style>