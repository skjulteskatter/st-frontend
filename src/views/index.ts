export * from "./collections";
export * from "./login/index";
export * from "./playlist";
export * from "./scriptures";
export * from "./tags";

const ContributorView = () => import("./ContributorView.vue");
const CreditSongView = () => import("./CreditSong.vue");
const DashboardView = () => import("./Dashboard.vue");
const SearchView = () => import("./dashboard/CompleteSearch.vue");
const Tutorials = () => import(/* webpackChunkName: 'tutorials' */ "./Tutorials.vue");
const ToolsView = () => import(/* webpackChunkName: 'tools' */ "./ToolsView.vue");

export {
    ContributorView,
    CreditSongView,
    DashboardView,
    SearchView,
    Tutorials,
    ToolsView,
};
