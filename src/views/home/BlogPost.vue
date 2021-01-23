<template>
    <div id="header-image" :style="{'backgroundImage': `url(${post.image})`}"></div>
    <div class="wrapper">
        <div class="container">
            <card class="post">
                <h1>{{ post.title }}</h1>
                <div id="post-body" v-if="body" v-html="body"></div>
            </card>
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
#header-image {
    width: 100vw;
    height: 30vh;

    background-size: cover;
    background-position: center;

    z-index: 0;
}

.wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.post {
    margin-top: -100px;
    height: 100vh;
    box-shadow: 0 10px 10px rgba(black, .1);
}

#post-body {
    img {
        max-width: 500px;
    } 
}
</style>