export * from "./books";

const ScriptureList = () => import(/* webpackChunkName: 'scriptures' */ "./List.vue");
const ScriptureView = () => import(/* webpackChunkName: 'scriptures' */ "./View.vue");
const Scriptures = () => import(/* webpackChunkName: 'scriptures' */ "./Scriptures.vue");

export {
    ScriptureList,
    ScriptureView,
    Scriptures,
};
