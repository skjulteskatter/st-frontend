import { ActionContext } from "vuex";
import { MutationTypes as SessionMTypes } from "./modules/session/mutation-types";
import { ActionTypes as SessionATypes } from "./modules/session/action-types";

export interface RootState {
  root: boolean;
  version: string;
}

export interface SessionStateTypes {
  counter?: number;
  rootDispatch?: boolean;
}

export interface CounterGettersTypes {
  doubledCounter(state: SessionStateTypes): number;
  counterValue(state: SessionStateTypes): number;
}

export type CounterMutationsTypes<S = SessionStateTypes> = {
  [SessionMTypes.SET_SESSION](state: S, payload: number): void;
  [SessionMTypes.CLEAR_SESSION](state: S): void;
};

export type AugmentedActionContext = {
  commit<K extends keyof CounterMutationsTypes>(
    key: K,
    payload: Parameters<CounterMutationsTypes[K]>[1]
  ): ReturnType<CounterMutationsTypes[K]>;
} & Omit<ActionContext<SessionStateTypes, RootState>, "commit">;

export interface CounterActionsTypes {
  [SessionATypes.GET_SESSION](
    { commit }: AugmentedActionContext,
    payload: number
  ): void;
}