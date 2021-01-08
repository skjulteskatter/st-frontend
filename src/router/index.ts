import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const Dashboard = () => import(/* webpackChunkName: 'dashboard' */ '../views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: 'login' */ '../views/Login.vue');
const Users = () => import(/* webpackChunkName: 'users' */ '../views/Users.vue');
const SongSelector = () => import(/* webpackChunkName: 'song' */ '../views/SongSelector.vue');
const LyricsViewer = () => import(/* webpackChunkName: 'lyrics' */ '../views/LyricsViewer.vue');

const routes: Array<RouteRecordRaw> = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
    },
    {
        path: '/',
        name: 'login',
        component: Login,
    },
    {
        path: '/users',
        name: 'users',
        component: Users,
    },
    {
        path: '/song',
        name: 'song',
        component: SongSelector,
    },
    {
        path: '/lyrics',
        name: 'lyrics',
        component: LyricsViewer,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
