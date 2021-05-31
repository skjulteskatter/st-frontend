import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import { store } from "@/store";
import "tailwindcss/tailwind.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/performance";
import "firebase/analytics";

// GLOBAL COMPONENTS
import { 
    Loader,
    BaseButton,
    Tooltip,
    BaseCard,
} from "@/components";
import { Icon } from "./components/icon";
import { BaseDropdown } from "./components/inputs";
import { firebaseConfig } from "./config";

firebase.initializeApp(firebaseConfig);

export const a = firebase.auth;
export const analytics = firebase.analytics();

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .component("icon", Icon)
    .component("loader", Loader)
    .component("base-button", BaseButton)
    .component("base-card", BaseCard)
    .component("tooltip", Tooltip)
    .component("base-dropdown", BaseDropdown)
    .mount("#app");
