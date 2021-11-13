const LoginView = () => import(/* webpackChunkName: 'loginView' */ "./LoginView.vue");
const LoginPage = () => import(/* webpackChunkName: 'login' */ "./LoginPage.vue");
const CreateUserView = () => import(/* webpackChunkName: 'loginCreateUserView' */ "./CreateUserView.vue");

export {
    LoginView,
    LoginPage,
    CreateUserView,
};
