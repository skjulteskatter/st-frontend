export * from "./login/index";

const CollectionView = () => import("./CollectionView.vue");
const ContributorView = () => import("./ContributorView.vue");
const CreditSongView = () => import("./CreditSong.vue");
const DashboardView = () => import("./Dashboard.vue");
const SearchView = () => import("./dashboard/CompleteSearch.vue");

export {
    CollectionView,
    ContributorView,
    CreditSongView,
    DashboardView,
    SearchView,
};
