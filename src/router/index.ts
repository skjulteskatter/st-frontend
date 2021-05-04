import { ensureLanguageIsFetched } from "@/i18n";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    await ensureLanguageIsFetched();
    next();
});

export default router;
