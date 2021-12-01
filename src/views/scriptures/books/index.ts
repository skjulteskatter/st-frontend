const BookView = () => import(/* webpackChunkName: 'scriptures' */ "./BookView.vue");
const BookList = () => import(/* webpackChunkName: 'scriptures' */ "./BookList.vue");
const ChapterList = () => import(/* webpackChunkName: 'scriptures' */ "./ChapterList.vue");
const ChapterView = () => import(/* webpackChunkName: 'scriptures' */ "./ChapterView.vue");

export {
    BookList,
    BookView,
    ChapterList,
    ChapterView,
};
