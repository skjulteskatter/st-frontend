import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const DashboardLayout = () => import(/* webpackChunkName: 'dashboardLayout' */ '../layout/DashboardLayout.vue');
const Dashboard = () => import(/* webpackChunkName: 'dashboard' */ '../views/Dashboard.vue');
const Admin = () => import(/* webpackChunkName: 'users' */ '../views/Admin.vue');
const SongSelector = () => import(/* webpackChunkName: 'song' */ '../views/SongSelector.vue');
const LyricsViewer = () => import(/* webpackChunkName: 'lyrics' */ '../views/LyricsViewer.vue');
const Store = () => import(/* webpackChunkName: 'store' */ '../views/Stripe.vue');
const Collections = () => import(/* webpackChunkName: 'collections' */ '../components/Songbooks.vue');
const SongList = () => import(/* webpackChunkName: 'songList' */ '../components/SongList.vue');
const SongViewer = () => import(/* webpackChunkName: 'songSettings' */ '../views/SongViewer.vue');

const Login = () => import(/* webpackChunkName: 'login' */ '../views/Login.vue');

// const HomeLayout = () => import(/* webpackChunkName: 'homeLayout' */ '../layout/HomeLayout.vue');
// const LandingPage = () => import(/* webpackChunkName: 'landingPage' */ '../views/home/LandingPage.vue');
// const Blog = () => import(/* webpackChunkName: 'blog' */ '../views/home/Blog.vue');
// const BlogPost = () => import(/* webpackChunkName: 'blogPost' */ '../views/home/BlogPost.vue');
// const Contact = () => import(/* webpackChunkName: 'landingPage' */ '../views/home/Contact.vue');

const Success = () => import(/* webpackChunkName: 'success' */ '../views/Success.vue');

const NotFound = () => import(/* webpackChunkName: 'notFound' */ '../views/NotFound.vue');

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
    // {
    //     path: '/',
    //     name: 'home',
    //     component: HomeLayout,
    //     children: [
    //         {
    //             path: '',
    //             name: 'landingpage',
    //             component: LandingPage,
    //         },
    //         {
    //             path: '/blog',
    //             name: 'blog',
    //             component: Blog,
    //         },
    //         {
    //             path: '/blog/:post',
    //             name: 'post',
    //             component: BlogPost
    //         },
    //         {
    //             path: '/contact',
    //             name: 'contact',
    //             component: Contact
    //         }
    //     ]
    // },
    {
        path: '/success',
        name: 'success',
        component: Success,
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

export default router;
