const PublicationCollections = () => import(/* webpackChunkName: 'publications'*/ "./Collections.vue");
const PublicationCollection = () => import(/* webpackChunkName: 'publications'*/ "./Collection.vue");
const PublicationsRoute = () => import(/* webpackChunkName: 'publications'*/ "./Publications.vue");
const ArticleList = () => import("./Articles.vue");

export {
    ArticleList,
    PublicationCollections,
    PublicationsRoute,
    PublicationCollection,
};
