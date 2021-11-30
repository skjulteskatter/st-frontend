import { ensureLanguageIsFetched } from "@/i18n";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (to.name === "chapter-view") {
            return { top: 0 };
        }
        if (savedPosition) {
            return savedPosition;
        }
    },
});

router.beforeEach(async (to, from, next) => {
    await ensureLanguageIsFetched();
    next();
});

export default router;
