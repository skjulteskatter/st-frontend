import { store as session, SessionStore, State as SessionState } from "./modules/session";
import { store as stripe, StripeStore, State as StripeState } from "./modules/stripe";
import { store as notifications, NotificationStore, State as NotificationState } from "./modules/notifications";
import { store as users, UserStore, State as UsersState } from "./modules/users"; 
import { createLogger, createStore } from "vuex";

export type RootState = {
    session: SessionState;
    stripe: StripeState;
    notifications: NotificationState;
    users: UsersState;
};
  
export type Store = SessionStore<Pick<RootState, "session">>
    & StripeStore<Pick<RootState, "stripe">>
    & NotificationStore<Pick<RootState, "notifications">>
    & UserStore<Pick<RootState, "users">>;
  
// Plug in logger when in development environment
const debug = process.env.NODE_ENV !== "production";
const plugins = debug ? [createLogger({})] : [];
  
export const store = createStore({
    plugins,
    modules: {
        session,
        stripe,
        notifications,
        users,
    },
});
  
export function useStore(): Store {
    return store as Store;
}
