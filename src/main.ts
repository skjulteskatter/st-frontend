import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import { store } from "@/store";
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
import { Icon } from "./components/icon";
import { BaseDropdown, BaseInput } from "./components/inputs";

createApp(App)
    .use(store)
    .use(router)
    .use(i18n)
    .component("Icon", Icon)
    .component("Loader", Loader)
    .component("BaseButton", BaseButton)
    .component("BaseCard", BaseCard)
    .component("BackButton", BackButton)
    .component("Tooltip", Tooltip)
    .component("BaseDropdown", BaseDropdown)
    .component("BaseInput", BaseInput)
    .mount("#app");
