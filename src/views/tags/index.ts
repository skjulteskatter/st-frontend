const TagList = () => import(/* webpackChunkName: 'tags' */ "./List.vue");
const TagView = () => import(/* webpackChunkName: 'tags' */ "./View.vue");

export {
    TagList,
    TagView,
};
