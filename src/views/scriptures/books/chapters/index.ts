const ChapterView = () => import(/* webpackChunkName: 'chapters' */ "./View.vue");
const ChapterList = () => import(/* webpackChunkName: 'chapters' */ "./List.vue");

export {
    ChapterList,
    ChapterView,
};
