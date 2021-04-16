import createPersistedState from "vuex-persistedstate";

import { store as session, SessionStore, State as SessionState } from "@/store/typed/modules/session";
import { createLogger, createStore } from "vuex";

export type RootState = {
    session: SessionState;
};
  
export type Store = SessionStore<Pick<RootState, "session">>;
  
// Plug in logger when in development environment
const debug = process.env.NODE_ENV !== "production";
const plugins = debug ? [createLogger({})] : [];
  
// Plug in session storage based persistence
plugins.push(createPersistedState({ storage: window.sessionStorage }));
  
export const store = createStore({
    plugins,
    modules: {
        session,
    },
});
  
export function useStore(): Store {
    return store as Store;
}