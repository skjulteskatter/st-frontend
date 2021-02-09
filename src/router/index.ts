import { ensureLanguageIsFetched } from '@/i18n';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const DashboardLayout = () => import(/* webpackChunkName: 'dashboardLayout' */ '../layout/DashboardLayout.vue');
const Dashboard = () => import(/* webpackChunkName: 'dashboard' */ '../views/Dashboard.vue');
const Admin = () => import(/* webpackChunkName: 'users' */ '../views/Admin.vue');
const SongSelector = () => import(/* webpackChunkName: 'song' */ '../views/SongSelector.vue');
const LyricsViewer = () => import(/* webpackChunkName: 'lyrics' */ '../views/LyricsViewer.vue');
const KaraokeViewer = () => import(/* webpackChunkName: 'karaoke' */ '../views/KaraokeViewer.vue');
const Store = () => import(/* webpackChunkName: 'store' */ '../views/Store.vue');
const Collections = () => import(/* webpackChunkName: 'collections' */ '../views/Collections.vue');
const SongList = () => import(/* webpackChunkName: 'songList' */ '../views/SongList.vue');
const SongViewer = () => import(/* webpackChunkName: 'songSettings' */ '../views/SongViewer.vue');
const ContributorView = () => import(/* wepbackChunkName: 'contributor' */ '../views/ContributorView.vue');

const Login = () => import(/* webpackChunkName: 'login' */ '../views/Login.vue');
const CreateUser = () => import(/* webpackChunkName: 'createUser' */ '../views/CreateUser.vue');

const Success = () => import(/* webpackChunkName: 'success' */ '../views/Success.vue');

const NotFound = () => import(/* webpackChunkName: 'notFound' */ '../views/NotFound.vue');
const VerifyEmail = () => import(/* webpackChunkName: 'notFound' */ '../views/VerifyEmail.vue');

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'dashboard',
        component: DashboardLayout,
        children: [
            {
                path: '',
                name: 'main',
                alias: '/dashboard',
                component: Dashboard,
            },
            {
                path: 'admin',
                name: 'admin',
                component: Admin,
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
                        name: 'song-list',
                        component: SongList,
                    },
                    {
                        path: ':collection/:number',
                        name: 'song',
                        component: SongViewer,
                    }
                ]
            },
            {
                path: 'contributors/:collection/:contributor',
                name: 'contributor',
                component: ContributorView,
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
        path: '/create',
        name: 'create-user',
        component: CreateUser,
    },
    {
        path: '/lyrics',
        name: 'lyrics',
        component: LyricsViewer,
    },
    {
        path: '/karaoke',
        name: 'karaoke',
        component: KaraokeViewer,
    },
    {
        path: '/success',
        name: 'success',
        component: Success,
    },
    {
        path: '/verify-email',
        name: 'verify-email',
        component: VerifyEmail,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    await ensureLanguageIsFetched();
    next();
})

export default router;
