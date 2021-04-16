import { store as session, SessionStore, State as SessionState } from "@/store/typed/modules/session";
import { store as stripe, StripeStore, State as StripeState } from "@/store/typed/modules/stripe";
import { createLogger, createStore } from "vuex";

export type RootState = {
    session: SessionState;
    stripe: StripeState;
};
  
export type Store = SessionStore<Pick<RootState, "session">>
    & StripeStore<Pick<RootState, "stripe">>;
  
// Plug in logger when in development environment
const debug = process.env.NODE_ENV !== "production";
const plugins = debug ? [createLogger({})] : [];
  
export const store = createStore({
    plugins,
    modules: {
        session,
        stripe,
    },
});
  
export function useStore(): Store {
    return store as Store;
}
