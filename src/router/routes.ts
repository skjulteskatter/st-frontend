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
    CollectionFiles,
    CollectionSongs,
    CollectionLists,
    Tutorials,
    ToolsView,
} from "@/views";

import { RouteRecordRaw } from "vue-router";

import StackedLayout from "@/layout/StackedLayout.vue";
import { ArticleList, PublicationCollection, PublicationCollections, PublicationsRoute } from "@/views/publications";

function getComponent<T>(func: () => Promise<T>) {
    return () => func().catch(() => {
        window.location.reload();
    });
} 

const Dashboard = () => import("../views/Dashboard.vue").catch(() => {
    window.location.reload();
});
const Admin = () => import("../views/Admin.vue").catch(() => {
    window.location.reload();
});
const SettingsView = () => import("../views/SettingsView.vue").catch(() => {
    window.location.reload();
});
const SongSelector = () => import("../views/SongSelector.vue").catch(() => {
    window.location.reload();
});
const PresentationView = () => import("../views/PresentationView.vue").catch(() => {
    window.location.reload();
});
const SongViewer = () => import("../views/SongViewer.vue").catch(() => {
    window.location.reload();
});
const ContributorView = () => import("../views/ContributorView.vue").catch(() => {
    window.location.reload();
});

const CompleteSearch = () => import("../views/dashboard/CompleteSearch.vue").catch(() => {
    window.location.reload();
});

const Success = () => import("../views/Success.vue").catch(() => {
    window.location.reload();
});

const NotFound = () => import("../views/NotFound.vue").catch(() => {
    window.location.reload();
});
const VerifyEmail = () => import("../views/VerifyEmail.vue").catch(() => {
    window.location.reload();
});

const SheetMusic = () => import("../views/SheetMusic.vue").catch(() => {
    window.location.reload();
});
const SongStatistics = () => import("../views/statistics/SongStatistics.vue").catch(() => {
    window.location.reload();
});
const CreditSong = () => import("../views/CreditSong.vue").catch(() => {
    window.location.reload();
});
const RedeemToken = () => import("../views/RedeemToken.vue").catch(() => {
    window.location.reload();
});
const PrintView = () => import("../views/PrintView.vue").catch(() => {
    window.location.reload();
});

const FavoritesView = () => import("../views/Favorites.vue").catch(() => {
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
                path: "tools",
                name: "tools",
                component: getComponent(ToolsView),
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
                path: "tutorials",
                name: "tutorials",
                component: getComponent(Tutorials),
            },
            // TODO: Move away from /songs/ to /collection/
            {
                path: "songs",
                name: "songs",
                component: getComponent(SongSelector),
                children: [
                    {
                        path: ":collection",
                        name: "collection-lists",
                        component: getComponent(CollectionLists),
                        children: [
                            {
                                path: "",
                                name: "song-list",
                                component: getComponent(CollectionSongs),
                            },
                            {
                                path: "files",
                                name: "collection-files",
                                component: getComponent(CollectionFiles),
                            },
                        ],
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
            {
                path: "/publications",
                name: "publications",
                component: getComponent(PublicationsRoute),
                children: [
                    {
                        path: "",
                        name: "publication-collection-list",
                        component: getComponent(PublicationCollections),
                    },
                    {
                        path: ":collectionId",
                        name: "publication-collection",
                        component: getComponent(PublicationCollection),
                    },
                    {
                        path: ":collectionId/:publicationId",
                        name: "article-list",
                        component: getComponent(ArticleList),
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
