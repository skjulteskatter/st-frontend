const Collections = () => import(/* webpackChunkName: 'collections' */ "./Collections.vue");
const CollectionList = () => import(/* webpackChunkName: 'collections' */ "./List.vue");
const CollectionView = () => import(/* webpackChunkName: 'collections' */ "./View.vue");

export {
    Collections,
    CollectionList,
    CollectionView,
};
