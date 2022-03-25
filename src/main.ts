import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import "tailwindcss/tailwind.css";
import "@/style/main.scss";
import "@/style/tailwind.css";

// GLOBAL COMPONENTS
import { 
    BackButton,
    BaseButton,
    BaseCard,
    Loader,
    Tooltip,
} from "@/components";
import { BaseDropdown, BaseInput } from "./components/inputs";
import { onAuthStateChanged } from "firebase/auth";
import auth, { a } from "./services/auth";
import { appSession } from "./services/session";
import client from "./services/client";

createApp(App)
    .use(router)
    .use(i18n)
    .component("Loader", Loader)
    .component("BaseButton", BaseButton)
    .component("BaseCard", BaseCard)
    .component("BackButton", BackButton)
    .component("Tooltip", Tooltip)
    .component("BaseDropdown", BaseDropdown)
    .component("BaseInput", BaseInput)
    .mount("#app");

onAuthStateChanged(a, async s => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("authToken");

    if (token) {
        await auth.loginWithToken(token);
    }

    appSession.user = await client.getUser();

    appSession.ready(s !== null);
});
