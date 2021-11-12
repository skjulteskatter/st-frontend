export * from "./chapters";

const BookView = () => import(/* webpackChunkName: 'scriptures' */ "./View.vue");
const BookList = () => import(/* webpackChunkName: 'scriptures' */ "./List.vue");

export {
    BookList,
    BookView,
};
