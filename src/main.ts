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
    BackButton,
} from "@/components";
import { Icon } from "./components/icon";
import { BaseDropdown, BaseInput } from "./components/inputs";

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .component("icon", Icon)
    .component("loader", Loader)
    .component("base-button", BaseButton)
    .component("base-card", BaseCard)
    .component("back-button", BackButton)
    .component("tooltip", Tooltip)
    .component("base-dropdown", BaseDropdown)
    .component("base-input", BaseInput)
    .mount("#app");
