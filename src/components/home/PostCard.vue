<template>
    <div class="post-preview">
        <div :style="{'backgroundImage': `url(${image})`}" class="post-preview__image"></div>
        <h2 class="post-preview__title">{{ title }}</h2>
        <b @click="openBlogPost(slug)" class="post-preview__button">Read more</b>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        image: String,
        title: String,
        slug: String
    }
})
export default class PostCard extends Vue {

    public openBlogPost(slug: string){
        this.$router.push(`/blog/${slug}`);
    }
}
</script>

<style lang="scss">
.post-preview {
    background: var(--background-color);

    &__image {
        width: 100%;
        height: 200px;
        background-size: cover;
        background-position: center;
    }

    &__title {
        margin-bottom: .5em;
    }

    &__button {
        color: var(--primary-color); 
        cursor: pointer
    }
}
</style>