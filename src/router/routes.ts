import { 
    Collections,
    CollectionList,
    CollectionView,
    CreateUserView, 
    LoginPage, 
    LoginView,
    BookList, 
    BookView, 
    // ChapterList, 
    ChapterView,
    ScriptureList, 
    Scriptures, 
    ScriptureView,
    Playlists,
    PlaylistList,
    PlaylistView,
    TagList,
    TagView,
} from "@/views";

import { RouteRecordRaw } from "vue-router";

import StackedLayout from "@/layout/StackedLayout.vue";

function getComponent<T>(func: () => Promise<T>) {
    return () => func().catch(() => {
        window.location.reload();
    });
} 

const Dashboard = () => import(/* webpackChunkName: 'dashboard' */ "../views/Dashboard.vue").catch(() => {
    window.location.reload();
});
const Admin = () => import(/* webpackChunkName: 'users' */ "../views/Admin.vue").catch(() => {
    window.location.reload();
});
const SettingsView = () => import(/* webpackChunkName: 'settings' */ "../views/SettingsView.vue").catch(() => {
    window.location.reload();
});
const SongSelector = () => import(/* webpackChunkName: 'song' */ "../views/SongSelector.vue").catch(() => {
    window.location.reload();
});
const PresentationView = () => import(/* webpackChunkName: 'presentationView' */ "../views/PresentationView.vue").catch(() => {
    window.location.reload();
});
const SongList = () => import(/* webpackChunkName: 'songList' */ "../views/SongList.vue").catch(() => {
    window.location.reload();
});
const SongViewer = () => import(/* webpackChunkName: 'songSettings' */ "../views/SongViewer.vue").catch(() => {
    window.location.reload();
});
const ContributorView = () => import(/* webpackChunkName: 'contributor' */ "../views/ContributorView.vue").catch(() => {
    window.location.reload();
});

const CompleteSearch = () => import(/* webpackChunkName: 'completeSearch' */ "../views/dashboard/CompleteSearch.vue").catch(() => {
    window.location.reload();
});

const Success = () => import(/* webpackChunkName: 'success' */ "../views/Success.vue").catch(() => {
    window.location.reload();
});

const NotFound = () => import(/* webpackChunkName: 'notFound' */ "../views/NotFound.vue").catch(() => {
    window.location.reload();
});
const VerifyEmail = () => import(/* webpackChunkName: 'notFound' */ "../views/VerifyEmail.vue").catch(() => {
    window.location.reload();
});

const SheetMusic = () => import(/* webpackChunkName: 'sheetMusic' */ "../views/SheetMusic.vue").catch(() => {
    window.location.reload();
});
const SongStatistics = () => import(/* webpackChunkName: 'songStatistics' */ "../views/statistics/SongStatistics.vue").catch(() => {
    window.location.reload();
});
const CreditSong = () => import(/* webpackChunkName: 'songStatistics' */ "../views/CreditSong.vue").catch(() => {
    window.location.reload();
});
const RedeemToken = () => import(/* webpackChunkName: 'redeemToken' */ "../views/RedeemToken.vue").catch(() => {
    window.location.reload();
});
const PrintView = () => import(/* webpackChunkName: 'printView' */ "../views/PrintView.vue").catch(() => {
    window.location.reload();
});

const FavoritesView = () => import(/* webpackChunkName: 'favoritesView' */ "../views/Favorites.vue").catch(() => {
    window.location.reload();
});

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "dashboard",
        component: StackedLayout,
        children: [
            {
                path: "",
                name: "main",
                alias: "/dashboard",
                component: getComponent(Dashboard),
            },
            {
                path: "credit",
                name: "credit",
                component: getComponent(CreditSong),
            },
            {
                path: "admin",
                name: "admin",
                component: getComponent(Admin),
            },
            {
                path: "tags",
                name: "tags",
                component: getComponent(TagList),
            },
            {
                path: "tags/:id",
                name: "tag",
                component: getComponent(TagView),
            },
            {
                path: "statistics/:id",
                name: "song-stats",
                component: getComponent(SongStatistics),
            },
            {
                path: "songs",
                name: "songs",
                component: getComponent(SongSelector),
                children: [
                    {
                        path: ":collection",
                        name: "song-list",
                        component: getComponent(SongList),
                    },
                    {
                        path: ":collection/:number",
                        name: "song",
                        component: getComponent(SongViewer),
                    },
                    {
                        path: "search",
                        name: "search",
                        component: getComponent(CompleteSearch),
                    },
                ],
            },
            {
                path: "contributors/:contributor",
                name: "contributor",
                component: getComponent(ContributorView),
            },
            {
                path: "collections",
                alias: "store",
                name: "collections",
                component: getComponent(Collections),
                children: [
                    {
                        path: "",
                        name: "collection-list",
                        component: getComponent(CollectionList),
                    },
                    {
                        path: ":id",
                        name: "collection-item",
                        component: getComponent(CollectionView),
                    },
                ],
            },

            {
                path: "settings",
                name: "settings",
                component: getComponent(SettingsView),
            },
            {
                path: "/custom-collections",
                alias: "/playlists",
                name: "custom-collections",
                component: getComponent(Playlists),
                children: [
                    {
                        path: "",
                        name: "playlist-overview",
                        component: getComponent(PlaylistList),
                    },
                    {
                        path: ":id",
                        name: "playlist-view",
                        component: getComponent(PlaylistView),
                    },
                ],
            },
            {
                path: "sharing",
                name: "sharing",
                component: getComponent(RedeemToken),
            },
            {
                path: "/favorites",
                name: "favorites",
                component: getComponent(FavoritesView),
            },
            {
                path: "/scriptures",
                name: "scriptures",
                component: getComponent(Scriptures),
                children: [
                    {
                        path: "",
                        name: "scripture-list",
                        component: getComponent(ScriptureList),
                    },
                    {
                        path: ":scriptureId",
                        name: "scripture-view",
                        component: getComponent(ScriptureView),
                        children: [
                            {
                                path: "",
                                name: "book-list",
                                component: getComponent(BookList),
                            },
                            {
                                path: ":bookId",
                                name: "book-view",
                                component: getComponent(BookView),
                                // children: [
                                //     {
                                //         path: "",
                                //         name: "chapter-list",
                                //         component: getComponent(ChapterList),
                                //     },
                                // ],
                            },
                            {
                                path: ":bookId/:chapterId",
                                name: "chapter-view",
                                component: getComponent(ChapterView),
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: "/login",
        name: "login-page",
        component: LoginPage,
        children: [
            {
                path: "",
                name: "login-view",
                component: LoginView,
            },
            {
                path: "create",
                alias: "/create",
                name: "create-user-view",
                component: CreateUserView,
            },
        ],
    },
    {
        path: "/presentation",
        name: "presentation-view",
        component: getComponent(PresentationView),
    },
    {
        path: "/success",
        name: "success",
        component: getComponent(Success),
    },
    {
        path: "/verify-email",
        name: "verify-email",
        component: getComponent(VerifyEmail),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: getComponent(NotFound),
    },
    {
        path: "/sheetmusic/:id",
        name: "sheet-music-embed",
        component: getComponent(SheetMusic),
    },
    {
        path: "/sheetmusic",
        name: "sheet-music",
        component: getComponent(SheetMusic),
    },
    {
        path: "/print",
        name: "print",
        component: getComponent(PrintView),
    },
];

export default routes;
