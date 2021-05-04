import { Collection, Lyrics, Song } from "@/classes";
//import { CacheService } from "./cacheservice";
import { ContributorCollectionItem } from "@/classes/collectionItems/contributorCollectionItem";
import { RedirectToCheckoutOptions } from "@stripe/stripe-js";
import { SessionRequest, SetupResponse } from "checkout";
import { ApiActivity, ApiCollection, ApiContributorCollectionItem, ApiCountryCollectionItem, ApiLyrics, ApiPlaylist, ApiSong, ApiTag, ApiThemeCollectionItem } from "dmb-api";
import http from "./http";

export const activity = {
    async getActivities() {
        return await http.get<ApiActivity[]>("api/Activity?expand=item&limit=20");
    },
    async pushActivities(activities: ApiActivity[]) {
        return await http.post<ApiActivity[]>("api/Activity", activities.map(a => {
            return {
                type: a.type,
                itemId: a.itemId,
                loggedDate: a.loggedDate,
            };
        }));
    },
};

export const session = {
    async getCurrentUser() {
        return await http.get<User>("api/Session");
    },
    saveUser(settings: UserSettings) {
        return http.patch<User>("api/Session", settings);
    },
    createUser(displayName: string) {
        return http.put("api/Session", { displayName });
    },
    uploadImage(fileName: string, base64Image: string) {
        return http.patch<{ image: string }>("api/Session/Image", { fileName, base64Image });
    },
};

export const items = {
    getLanguages() {
        return http.get<Language[]>("api/Languages");
    },
    getTranslations(languages: string[]) {
        return http.get<{
            [key: string]: {
                [key: string]: string;
            };
        }>("api/Localization?languages=" + languages.join(","), true);
    },
};

export const admin = {
    async getAllSubscriptions() {
        return await http.get<Subscription[]>("api/Admin/Subscriptions");
    },
    getAllUsers() {
        return http.get<User[]>("api/Admin/Users");
    },
    getRoles() {
        return http.get<string[]>("api/Admin/Roles");
    },
    setRoles(user: User, roles: string[]) {
        return http.patch<User>(`api/Admin/User/${user.id}/Roles`, roles);
    },
    clearCache(collectionId: string) {
        return http.get<string>(`api/Admin/ClearCache/${collectionId}`);
    },
    clearLandaxCache() {
        return http.get<string>("api/Admin/ClearCache/Landax");
    },
    sync() {
        return http.get<{ result: string }>("api/Admin/Sync");
    },
};

export const songs = {
    async getCollections() {
        return (await http.get<ApiCollection[]>("api/Collections?expand=details,name")).map(c => new Collection(c));
    },
    async getAllSongs(collection: ApiCollection, lastUpdated?: string) {
        return (await http.get<ApiSong[]>(`api/Songs/${collection.id}?expand=participants/contributor,details,videoFiles/contributors,audioFiles/contributors,sheetMusic,themes,transpositions,copyright` + (lastUpdated ? "&updatedAt=" + lastUpdated : ""))).map(s => new Song(s));
    },
    async getLyrics(collection: ApiCollection, number: number, language: string, format: string, transpose: number, transcode: string) {
        return new Lyrics(await http.get<ApiLyrics>(`api/Lyrics/${collection.id}/${number}?language=${language}&format=${format}&transpose=${transpose}&transcode=${transcode}`));
    },
    async getAllLyrics(collection: ApiCollection, language: string, format: string, transpose: number, lastUpdated?: string) {
        const uri = `api/Lyrics/${collection.id}?language=${language}&format=${format}&transpose=${transpose}` + (lastUpdated ? `&updatedAt=${lastUpdated}` : "");
        return (await http.get<ApiLyrics[]>(uri)).map(l => new Lyrics(l));
    },
    async getContributor(id: string) {
        return new ContributorCollectionItem((await http.get<ApiContributorCollectionItem>(`api/Contributor/${id}?expand=contributor/biography,songs/collection`)));
    },
    async getAllContributors(lastUpdated?: string) {
        return await http.get<ApiContributorCollectionItem[]>("api/Contributors?expand=contributor/biography" + (lastUpdated ? "&updatedAt=" + lastUpdated : ""));
    },
    // async getAllAuthors(collection: ApiCollection, lastUpdated?: string) {
    //     return await http.get<ApiContributorCollectionItem[]>(`api/Authors/${collection.id}` + (lastUpdated ? "?updatedAt=" + lastUpdated : "")); //).map(c => new ContributorCollectionItem(c));
    // },
    // async getAllComposers(collection: ApiCollection, lastUpdated?: string) {
    //     return await http.get<ApiContributorCollectionItem[]>(`api/Composers/${collection.id}` + (lastUpdated ? "?updatedAt=" + lastUpdated : "")); //).map(c => new ContributorCollectionItem(c));
    // },
    async getAllThemes(collection: ApiCollection) {
        return await http.get<ApiThemeCollectionItem[]>(`api/Themes/${collection.id}`); //).map(ci => new ThemeCollectionItem(ci));
    },
    async getAllCountries(collection: ApiCollection) {
        return await http.get<ApiCountryCollectionItem[]>(`api/Countries/${collection.id}`); //).map(ci => new CountryCollectionItem(ci));
    },
    /**
     * Search accross collections.
     * @param search 
     * @param language 
     * @returns 
     */
    async searchCollections(search: string, language: string) {
        return (await http.get<ApiSong[]>(`api/Songs/Search/${search}?language=${language}&expand=collection,participants/contributor`)).map(s => new Song(s));
    },
};

export const playlists = {
    async getPlaylists() {
        return (await http.get<ApiPlaylist[]>("api/Playlists?expand=entries/song/collection"));
    },
    async getPlaylist(id: string) {
        return (await http.get<ApiPlaylist>("api/Playlists/" + id + "?expand=entries/song/collection"));
    },
    async createPlaylist(name: string) {
        return await http.post<ApiPlaylist, unknown>("api/Playlists?expand=entries/song/collection", {name});
    },
    async deletePlaylist(id: string){
        return (await http.delete(`api/Playlists/${id}`));
    },
    async addToPlaylist(playlistId: string, songId: string, transposition?: number) {
        return await http.post<ApiPlaylist, unknown>(`api/Playlists/${playlistId}?expand=entries/song/collection`, {
            songId,
            transposition,
        });
    },
    async removeEntryFromPlaylist(playlistId: string, entryId: string) {
        return (await http.delete<ApiPlaylist>(`api/Playlists/${playlistId}/${entryId}?expand=entries/song/collection`));
    },
};

export const tags = {
    async getAll(expand = false) {
        return (await http.get<ApiTag[]>("api/Tags" + (expand ? "?expand=songs" : "")));
    },
    async get(id: string, expand = false) {
        return (await http.get<ApiTag>("api/Tags/" + id + (expand ? "?expand=songs" : "")));
    },
    async create(name: string, color: string, songId: string) {
        return (await http.post("api/Tags", {name, color, songId})) as ApiTag;
    },
    async update(id: string, name?: string, color?: string) {
        return (await http.patch("api/Tags/" + id, {
            name,
            color,
        }));
    },
    async delete(id: string){
        return (await http.delete(`api/Tags/${id}`));
    },
    async addToTag(id: string, songId: string) {
        return (await http.post<ApiTag>(`api/Tags/${id}/${songId}`));
    },
    async removeFromTag(id: string, songId: string) {
        return (await http.delete<ApiTag>(`api/Tags/${id}/${songId}`));
    },
};

export const stripe = {
    setup() {
        return http.get<SetupResponse>("api/Store/Setup");
    },
    startSession(productIds: string[]) {
        return http.post<RedirectToCheckoutOptions, SessionRequest>("api/Store/Session", {
            productIds,
            cancelUrl: window.location.origin + "/dashboard",
            successUrl: window.location.origin + "/success",
        });
    },
    getSession(sessionId: string) {
        return http.get<RedirectToCheckoutOptions>(`api/Store/Session/${sessionId}`);
    },
    getPortalSession() {
        return http.post("api/Store/Portal", {
            returnUrl: `${window.location.origin}/collections`,
        });
    },
    refreshSubscriptions() {
        return http.get("api/Store/Refresh");
    },
};

const api = {
    session,
    admin,
    songs,
    items,
    stripe,
    playlists,
    activity,
    tags,
};

export default api;
