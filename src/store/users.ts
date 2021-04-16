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
        },
        async setRoles({commit}, user: User) {
            const roles = [];
            for (const role of user.roles) {
                roles.push(role);
            }
            const result = await api.admin.setRoles(user, roles);

            commit('setRoles', {user, roles: result.roles});
        }
    },
    mutations: {
        users(state, users: User[]) {
            state.users = users;
        },
        roles(state, roles: string[]) {
            state.roles = roles;
        },
        toggleRole(state, obj: {user: User; role: string}) {
            if (obj.user.roles.find(r => r == obj.role)) {
                obj.user.roles = obj.user.roles.filter(r => r != obj.role);
            } else {
                obj.user.roles.push(obj.role);
            }
        },
        setRoles(state, obj: {user: User; roles: string[]}) {
            obj.user.roles = obj.roles;
        }
    }
});
