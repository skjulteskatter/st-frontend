import sanity, { Post } from "@/services/sanity";
import { InjectionKey } from "vue";
import { createStore } from "vuex";

interface SanityStore {
    current: Post;
    posts: Post[];
}

export const sanityKey: InjectionKey<SanityStore> = Symbol();

export const sanityStore = createStore<SanityStore>({
    state: {
        current: {} as Post,
        posts: []
    },
    actions: {
        async setCurrent({ state, commit }, slug: string) {
            if (![state.current.slug, state.current._id].includes(slug)) {
                const post = await sanity.getPost(slug, 'no');
                commit('current', post);
            }

        },
        async getPosts({ commit }) {
            const posts = await sanity.getAllPosts();
            commit('setPosts', posts ?? []);
        }
    },
    mutations: {
        current(state, post: Post) {
            state.current = post ?? {} as Post;
        },
        setPosts(state, posts: Post[]) {
            state.posts = posts;
        }
    }
})