const Playlists = () => import("./Playlists.vue");
const PlaylistList = () => import("./List.vue");
const PlaylistView = () => import(/* webpackChunkNane: 'playlists' */ "./View.vue");

export {
    Playlists,
    PlaylistList,
    PlaylistView,
};
