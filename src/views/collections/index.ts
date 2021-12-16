const Collections = () => import(/* webpackChunkName: 'collections' */ "./Collections.vue");
const CollectionList = () => import(/* webpackChunkName: 'collections' */ "./List.vue");
const CollectionLists = () => import(/* webpackChunkName: 'collections' */ "./Lists.vue");
const CollectionView = () => import(/* webpackChunkName: 'collections' */ "./View.vue");
const CollectionFiles = () => import(/* webpackChunkName: 'files' */ "./Files.vue");
const CollectionSongs = () => import(/* webpackChunkName: 'songs' */ "./Songs.vue");

export {
    Collections,
    CollectionList,
    CollectionLists,
    CollectionView,
    CollectionFiles,
    CollectionSongs,
};
