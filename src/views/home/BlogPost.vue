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