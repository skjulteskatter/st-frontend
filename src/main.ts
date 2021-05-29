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
} from "@/components";
import { Icon } from "./components/icon";
import { BaseDropdown } from "./components/inputs";

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .component("Icon", Icon)
    .component("loader", Loader)
    .component("base-button", BaseButton)
    .component("tooltip", Tooltip)
    .component("base-dropdown", BaseDropdown)
    .mount("#app");
