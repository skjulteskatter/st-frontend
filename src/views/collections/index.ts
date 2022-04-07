const Collections = () => import("./Collections.vue");
const CollectionList = () => import("./List.vue");
const CollectionLists = () => import("./Lists.vue");
const CollectionView = () => import("./View.vue");
const CollectionFiles = () => import("./Files.vue");

export * from "./songs";

export {
    Collections,
    CollectionList,
    CollectionLists,
    CollectionView,
    CollectionFiles,
};
