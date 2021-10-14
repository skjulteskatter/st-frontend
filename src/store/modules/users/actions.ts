
import { ActionContext, ActionTree } from "vuex";
import { Mutations } from "./mutations";
import { State } from "./state";
import { RootState } from "../..";
import { UsersActionTypes } from "./action-types";
import api from "@/services/api";
import { UsersMutationTypes } from "./mutation-types";
import { User } from "@/classes";

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, "commit">;

export interface Actions {
    [UsersActionTypes.GET_ROLES]({ commit }: AugmentedActionContext): Promise<void>;
    [UsersActionTypes.SET_ROLES]({ commit }: AugmentedActionContext, payload: User): Promise<void>;
}

export const actions: ActionTree<State, RootState> & Actions = {
    async [UsersActionTypes.GET_ROLES]({ commit }) {
        const result = await api.admin.getRoles();
        commit(UsersMutationTypes.SET_ROLES, result);
    },
    async [UsersActionTypes.SET_ROLES]({ commit }, user) {
        const roles = [];
        for (const role of user.roles) {
            roles.push(role);
        }
        const result = await api.admin.setRoles(user, roles);

        commit(UsersMutationTypes.USER_SET_ROLES, {user, roles: result.roles});
    },
};
