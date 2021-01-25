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
import { Post } from "@/services/sanity";
import { useStore } from "vuex";
import { sanityKey } from "@/store/sanity";

@Options({
    components: {
        Card,
    }
})
export default class BlogPost extends Vue {
    public store = useStore(sanityKey);

    public async mounted() {
        await this.store.dispatch('setCurrent', this.$route.params.post as string);
    }

    public get post(): Post {
        return this.store.state.current ?? {} as Post;
    }

    public get body(): HTMLElement | undefined {
        return this.store.state.body;
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