export * from "./chapters";

const BookView = () => import(/* webpackChunkName: 'books' */ "./View.vue");
const BookList = () => import(/* webpackChunkName: 'books' */ "./List.vue");

export {
    BookList,
    BookView,
};
