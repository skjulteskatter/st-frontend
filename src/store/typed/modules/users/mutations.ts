import { MutationTree } from "vuex";
import { State } from "./state";
import { UsersMutationTypes } from "./mutation-types";

export type Mutations<S = State> = {
    [UsersMutationTypes.SET_USERS](state: S, payload: User[]): void;
    [UsersMutationTypes.SET_ROLES](state: S, payload: string[]): void;
    [UsersMutationTypes.USER_SET_ROLES](state: S, payload: {user: User; roles: string[]}): void;
    [UsersMutationTypes.USER_TOGGLE_ROLE](state: S, payload: {user: User; role: string}): void;
}

export const mutations: MutationTree<State> & Mutations = {
    [UsersMutationTypes.SET_USERS](state, users) {
        state.users = users;
    },
    [UsersMutationTypes.SET_ROLES](state, roles) {
        state.roles = roles;
    },
    [UsersMutationTypes.USER_TOGGLE_ROLE](state, obj) {
        if (obj.user.roles.find(r => r == obj.role)) {
            obj.user.roles = obj.user.roles.filter(r => r != obj.role);
        } else {
            obj.user.roles.push(obj.role);
        }
    },
    [UsersMutationTypes.USER_SET_ROLES](state, obj) {
        obj.user.roles = obj.roles;
    },
};
