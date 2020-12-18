import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface Session {
    currentUser: User;
}

export const key: InjectionKey<Store<Session>> = Symbol()

export const store = createStore<Session>({
    state: {
        currentUser: {} as User
    }
})