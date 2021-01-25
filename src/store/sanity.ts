import sanity, { Post } from "@/services/sanity";
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

interface SanityStore {
    current?: Post;
    posts: Post[];
    languageKey: string;
    body?: HTMLElement;
}

export const sanityKey: InjectionKey<Store<SanityStore>> = Symbol();

export const sanityStore = createStore<SanityStore>({
    state: {
        current: undefined,
        posts: [],
        languageKey: 'no',
        body: undefined,
    },
    actions: {
        init({commit}) {
            commit('setLanguage', localStorage.getItem('languageKey') ?? 'no');
        },
        async setCurrent({ state, commit }, slug: string) {
            if (!state.current || ![state.current.slug, state.current._id].includes(slug)) {
                const result = await sanity.getPost(slug, state.languageKey);
                commit('current', result.post);
                commit('body', result.body);
            }
        },
        async getPosts({ state, commit }) {
            const posts = await sanity.getAllPosts(state.languageKey);
            commit('setPosts', posts ?? []);
        },
        async setLanguage({ state, commit }, languageKey: string) {
            commit('setLanguage', languageKey);

            await this.dispatch('getPosts');
            if (state.current) {
                await this.dispatch('setCurrent', state.current.slug);
            }
        }
    },
    mutations: {
        current(state, post: Post) {
            state.current = post ?? {} as Post;
        },
        body(state, body: HTMLDivElement) {
            state.body = body;
        },
        setPosts(state, posts: Post[]) {
            state.posts = posts;
        },
        setLanguage(state, languageKey: string) {
            state.languageKey = languageKey;
        }
    }
})