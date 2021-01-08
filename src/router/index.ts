import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const Dashboard = () => import(/* webpackChunkName: 'dashboard' */ '../views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: 'login' */ '../views/Login.vue');
const Users = () => import(/* webpackChunkName: 'users' */ '../views/Users.vue');
const Song = () => import(/* webpackChunkName: 'song' */ '../views/ViewSong.vue');

const routes: Array<RouteRecordRaw> = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard
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
        component: Song,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
