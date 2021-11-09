export * from "./books";

const ScriptureList = () => import(/* webpackChunkName: 'scriptureList' */ "./List.vue");
const ScriptureView = () => import(/* webpackChunkName: 'scriptureList' */ "./View.vue");
const Scriptures = () => import(/* webpackChunkName: 'scriptureList' */ "./Scriptures.vue");

export {
    ScriptureList,
    ScriptureView,
    Scriptures,
};
