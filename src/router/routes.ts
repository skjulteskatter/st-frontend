import { RouteRecordRaw } from "vue-router";

import StackedLayout from "../layout/StackedLayout.vue";

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
// const LyricsViewer = () => import(/* webpackChunkName: 'lyrics' */ "../views/LyricsViewer.vue").catch(() => {
//     window.location.reload();
// });
const PresentationView = () => import(/* webpackChunkName: 'presentationView' */ "../views/PresentationView.vue").catch(() => {
    window.location.reload();
});
// const KaraokeViewer = () => import(/* webpackChunkName: 'karaoke' */ "../views/KaraokeViewer.vue").catch(() => {
//     window.location.reload();
// });
const SongList = () => import(/* webpackChunkName: 'songList' */ "../views/SongList.vue").catch(() => {
    window.location.reload();
});
const SongViewer = () => import(/* webpackChunkName: 'songSettings' */ "../views/SongViewer.vue").catch(() => {
    window.location.reload();
});
const ContributorView = () => import(/* webpackChunkName: 'contributor' */ "../views/ContributorView.vue").catch(() => {
    window.location.reload();
});

const CollectionView = () => import(/* webpackChunkName: 'store' */ "../views/CollectionView.vue").catch(() => {
    window.location.reload();
});
const CollectionItem = () => import(/* webpackChunkName: 'store-item' */ "../views/collections/CollectionItem.vue").catch(() => {
    window.location.reload();
});
const CollectionList = () => import(/* webpackChunkName: 'store-home' */ "../views/collections/CollectionList.vue").catch(() => {
    window.location.reload();
});

const Playlist = () => import(/* webpackChunkName: 'playlist' */ "../views/playlist/Playlist.vue").catch(() => {
    window.location.reload();
});
const PlaylistView = () => import(/* webpackChunkName: 'playlist-view' */ "../views/playlist/PlaylistView.vue").catch(() => {
    window.location.reload();
});
const PlaylistOverview = () => import(/* webpackChunkName: 'playlist-overview' */ "../views/playlist/PlaylistOverview.vue").catch(() => {
    window.location.reload();
});


const CompleteSearch = () => import(/* webpackChunkName: 'completeSearch' */ "../views/dashboard/CompleteSearch.vue").catch(() => {
    window.location.reload();
});

const Login = () => import(/* webpackChunkName: 'login' */ "../views/Login.vue").catch(() => {
    window.location.reload();
});
const CreateUser = () => import(/* webpackChunkName: 'createUser' */ "../views/CreateUser.vue").catch(() => {
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
const TagView = () => import(/* webpackChunkName: 'tagList' */ "../views/tags/TagView.vue").catch(() => {
    window.location.reload();
});
const TagList = () => import(/* webpackChunkName: 'tagsList' */ "../views/tags/TagList.vue").catch(() => {
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
                component: Dashboard,
            },
            {
                path: "credit",
                name: "credit",
                component: CreditSong,
            },
            {
                path: "admin",
                name: "admin",
                component: Admin,
            },
            {
                path: "tags",
                name: "tags",
                component: TagList,
            },
            {
                path: "tags/:id",
                name: "tag",
                component: TagView,
            },
            {
                path: "statistics/:id",
                name: "song-stats",
                component: SongStatistics,
            },
            {
                path: "songs",
                name: "songs",
                component: SongSelector,
                children: [
                    {
                        path: ":collection",
                        name: "song-list",
                        component: SongList,
                    },
                    {
                        path: ":collection/:number",
                        name: "song",
                        component: SongViewer,
                    },
                    {
                        path: "search",
                        name: "search",
                        component: CompleteSearch,
                    },
                ],
            },
            {
                path: "contributors/:contributor",
                name: "contributor",
                component: ContributorView,
            },
            {
                path: "collections",
                alias: "store",
                name: "collections",
                component: CollectionView,
                children: [
                    {
                        path: "",
                        name: "collection-list",
                        component: CollectionList,
                    },
                    {
                        path: ":id",
                        name: "collection-item",
                        component: CollectionItem,
                    },
                ],
            },

            {
                path: "settings",
                name: "settings",
                component: SettingsView,
            },
            {
                path: "/playlists",
                name: "playlists",
                component: Playlist,
                children: [
                    {
                        path: "",
                        name: "playlist-overview",
                        component: PlaylistOverview,
                    },
                    {
                        path: ":id",
                        name: "playlist-view",
                        component: PlaylistView,
                    },
                ],
            },
            {
                path: "sharing",
                name: "sharing",
                component: RedeemToken,
            },
            {
                path: "/favorites",
                name: "favorites",
                component: FavoritesView,
            },
        ],
    },
    {
        path: "/login",
        name: "login",
        component: Login,
    },
    {
        path: "/create",
        name: "create-user",
        component: CreateUser,
    },
    // {
    //     path: "/lyrics",
    //     name: "lyrics",
    //     component: LyricsViewer,
    // },
    {
        path: "/presentation",
        name: "presentation-view",
        component: PresentationView,
    },
    // {
    //     path: "/karaoke",
    //     name: "karaoke",
    //     component: KaraokeViewer,
    // },
    {
        path: "/success",
        name: "success",
        component: Success,
    },
    {
        path: "/verify-email",
        name: "verify-email",
        component: VerifyEmail,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: NotFound,
    },
    {
        path: "/sheetmusic/:id",
        name: "sheet-music-embed",
        component: SheetMusic,
    },
    {
        path: "/sheetmusic",
        name: "sheet-music",
        component: SheetMusic,
    },
    {
        path: "/print",
        name: "print",
        component: PrintView,
    },
];

export default routes;
