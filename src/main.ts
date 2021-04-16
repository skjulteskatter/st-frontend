import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import { usersStore, usersKey, songStore, songKey } from "./store";
import { store } from "@/store/typed";

createApp(App)
    .use(store)
    .use(usersStore, usersKey)
    .use(songStore, songKey)
    .use(router)
    .use(i18n)
    .mount("#app");
