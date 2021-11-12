const Playlists = () => import(/* webpackChunkName: 'playlists' */ "./Playlists.vue");
const PlaylistList = () => import(/* webpackChunkName: 'playlists' */ "./List.vue");
const PlaylistView = () => import(/* webpackChunkNane: 'playlists' */ "./View.vue");

export {
    Playlists,
    PlaylistList,
    PlaylistView,
};
