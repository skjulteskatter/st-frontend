import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const Dashboard = () => import(/* webpackChunkName: 'dashboard' */ '../views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: 'login' */ '../views/Login.vue');
const Users = () => import(/* webpackChunkName: 'users' */ '../views/Users.vue');
const SongSelector = () => import(/* webpackChunkName: 'song' */ '../views/SongSelector.vue');
const LyricsViewer = () => import(/* webpackChunkName: 'lyrics' */ '../views/LyricsViewer.vue');
const DashboardLayout = () => import(/* webpackChunkName: 'dashboardLayout' */ '../layout/DashboardLayout.vue');
const Store = () => import(/* webpackChunkName: 'store' */ '../views/Stripe.vue');
const HomeLayout = () => import(/* webpackChunkName: 'homeLayout' */ '../layout/HomeLayout.vue');

const Collections = () => import(/* webpackChunkName: 'collections' */ '../components/Songbooks.vue');
const SongList = () => import(/* webpackChunkName: 'songList' */ '../components/SongList.vue');
const SongSettings = () => import(/* webpackChunkName: 'songSettings' */ '../components/LyricsSettings.vue');

const routes: Array<RouteRecordRaw> = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardLayout,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: Dashboard,
            },
            {
                path: 'users',
                name: 'users',
                component: Users,
            },
            {
                path: 'songs',
                name: 'songs',
                component: SongSelector,
                children: [
                    {
                        path: '',
                        name: 'collections',
                        component: Collections,
                    },
                    {
                        path: ':collection',
                        name: 'songs',
                        component: SongList,
                    },
                    {
                        path: ':collection/:number',
                        name: 'song',
                        component: SongSettings,
                    }
                ]
            },
            {
                path: 'store',
                name: 'store',
                component: Store,
            }
        ],
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/lyrics',
        name: 'lyrics',
        component: LyricsViewer,
    },
    {
        path: '/',
        name: 'home',
        component: HomeLayout,
        children: [
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
