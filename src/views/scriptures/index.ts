export * from "./books";

const ScriptureList = () => import("./List.vue");
const ScriptureView = () => import("./View.vue");
const Scriptures = () => import("./Scriptures.vue");

export {
    ScriptureList,
    ScriptureView,
    Scriptures,
};
