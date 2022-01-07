const PublicationCollections = () => import(/* webpackChunkName: 'publications'*/ "./Collections.vue");
const PublicationCollection = () => import(/* webpackChunkName: 'publications'*/ "./Collection.vue");
const PublicationsRoute = () => import(/* webpackChunkName: 'publications'*/ "./Publications.vue");

export {
    PublicationCollections,
    PublicationsRoute,
    PublicationCollection,
};
