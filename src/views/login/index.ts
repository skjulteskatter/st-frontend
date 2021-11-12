const LoginView = () => import(/* webpackChunkName: 'login' */ "./LoginView.vue");
const LoginPage = () => import(/* webpackChunkName: 'login' */ "./LoginPage.vue");
const CreateUserView = () => import(/* webpackChunkName: 'login' */ "./CreateUserView.vue");

export {
    LoginView,
    LoginPage,
    CreateUserView,
};
