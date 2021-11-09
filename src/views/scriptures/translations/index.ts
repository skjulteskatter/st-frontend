const TranslationView = () => import(/* webpackChunkName: 'translationView' */ "./View.vue");
const TranslationList = () => import(/* webpackChunkName: 'translationList' */ "./List.vue");

export {
    TranslationList,
    TranslationView,
};
