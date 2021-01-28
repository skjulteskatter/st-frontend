<template>
    <div class="post-preview slideIn" @click="openBlogPost(slug)">
        <div :style="{'backgroundImage': `url(${image})`}" class="post-preview__image">
            <h2 class="post-preview__title secondary" v-if="secondary">{{ title }}</h2>
            <p class="post-preview__excerpt secondary" v-if="excerpt && secondary">{{ excerpt }}</p>
        </div>
        <h2 class="post-preview__title" v-if="!secondary">{{ title }}</h2>
        <p class="post-preview__excerpt" v-if="excerpt && !secondary">{{ excerpt }}</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
    props: {
        image: String,
        title: String,
        slug: String,
        excerpt: String,
        secondary: Boolean
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
    background: var(--st-background-color);
    cursor: pointer;

    &:hover {
        .post-preview__title {
            text-decoration: underline;
        }
    }

    &__image {
        width: 100%;
        height: 200px;
        background-size: cover;
        background-position: center;

        padding: var(--st-spacing);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    &__title {
        margin-bottom: .5em;
        
        &.secondary {
            color: white;
            text-shadow: 0 0 5px rgba(black, .5);
        }
    }

    &__excerpt {
        margin: 0;

        &.secondary {
            color: white;
            text-shadow: 0 0 5px rgba(black, .5);
        }
    }

}
</style>