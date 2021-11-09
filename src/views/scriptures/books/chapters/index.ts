const ChapterView = () => import(/* webpackChunkName: 'chapterView' */ "./View.vue");
const ChapterList = () => import(/* webpackChunkName: 'chapterList' */ "./List.vue");

export {
    ChapterList,
    ChapterView,
};
