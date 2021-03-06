export enum SessionMutationTypes {
    SET_LANGUAGES = "SET_LANGUAGES",

    INITIALIZED = "INITIALIZED",

    // COLLECTIONS = "COLLECTIONS",
    // COLLECTION = "COLLECTION",

    SET_TAGS = "SET_TAGS",
    SET_TAG = "SET_TAG",
    DELETE_TAG = "DELTE_TAG",
    TAG_ADD_SONG = "TAG_ADD_SONG",
    TAG_REMOVE_SONG = "TAG_REMOVE_SONG",

    SET_PLAYLISTS = "SET_PLAYLISTS",
    UPDATE_PLAYLIST = "UPDATE_PLAYLIST",
    SET_PLAYLIST = "SET_PLAYLIST",
    DELETE_PLAYLIST = "DELETE_PLAYLIST",
    
    EXTEND = "EXTEND",
    ERROR = "ERROR",
    REDIRECT = "REDIRECT",
    SET_LOG_ITEMS = "SET_LOG_ITEMS",
    CLEAR_LOGS = "CLEAR_LOGS",
    SPLASH = "SPLASH",
}
