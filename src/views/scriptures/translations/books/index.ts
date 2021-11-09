export * from "./chapters";

const BookView = () => import(/* webpackChunkName: 'bookView' */ "./View.vue");
const BookList = () => import(/* webpackChunkName: 'bookList' */ "./List.vue");

export {
    BookList,
    BookView,
};
