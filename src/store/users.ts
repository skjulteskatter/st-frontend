
import { createStore, Store } from 'vuex';
import { InjectionKey } from 'vue';
import api from '@/services/api';

export interface Users {
    users: User[];
    roles: string[];
}

export const usersKey: InjectionKey<Store<Users>> = Symbol();

export const usersStore = createStore<Users>({
    state: {
        users: [],
        roles: []
    },
    actions: {
        async getUsers() {
            const result = await api.admin.getAllUsers();
            this.commit('users', result ?? []);
        },
        async getRoles() {
            const result = await api.admin.getRoles();
            this.commit('roles', result ?? []);
        }
    },
    mutations: {
        users(state, users: User[]) {
            state.users = users;
        },
        roles(state, roles: string[]) {
            state.roles = roles;
        }
    }
});
