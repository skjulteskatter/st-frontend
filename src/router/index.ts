import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
const Login = () => import(/* webpackChuhnkName: 'login' */ '../views/Login.vue');
const Users = () => import(/* webpackChunkName: 'users' */ '../views/Users.vue')
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
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router
