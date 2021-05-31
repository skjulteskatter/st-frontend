import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import { store } from "@/store";
import "tailwindcss/tailwind.css";

// GLOBAL COMPONENTS
import { 
    Loader,
    BaseButton,
    Tooltip,
    BaseCard,
} from "@/components";
import { Icon } from "./components/icon";
import { BaseDropdown } from "./components/inputs";

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
