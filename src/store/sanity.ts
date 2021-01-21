import sanity, { Post } from "@/services/sanity";
import { InjectionKey } from "vue";
import { createStore } from "vuex";

interface SanityStore {
    current: Post;
}

export const sanityKey: InjectionKey<SanityStore> = Symbol();

export const sanityStore = createStore<SanityStore>({
    state: {
        current: {} as Post,
    },
    actions: {
        async setCurrent({ state, commit }, slug: string) {
            if (![state.current.slug, state.current._id].includes(slug)) {
                const post = await sanity.getPost(slug);
                commit('current', post);
            }

        }
    },
    mutations: {
        current( state, post: Post) {
            state.current = post ?? {} as Post;
        }
    }
})