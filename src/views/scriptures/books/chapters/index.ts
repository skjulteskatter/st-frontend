const ChapterView = () => import(/* webpackChunkName: 'scriptures' */ "./View.vue");
const ChapterList = () => import(/* webpackChunkName: 'scriptures' */ "./List.vue");

export {
    ChapterList,
    ChapterView,
};
