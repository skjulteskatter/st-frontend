import { Collection, Lyrics, Song } from "@/classes";
import { ContributorCollectionItem } from "@/classes/collectionItems/contributorCollectionItem";
import { CountryCollectionItem } from "@/classes/collectionItems/countryCollectionItem";
import { ThemeCollectionItem } from "@/classes/collectionItems/themeCollectionItem";
import { RedirectToCheckoutOptions } from "@stripe/stripe-js";
import { SessionRequest, SetupResponse } from "checkout";
import { ApiActivity, ApiCollection, ApiContributorCollectionItem, ApiCountryCollectionItem, ApiLyrics, ApiPlaylist, ApiSong, ApiThemeCollectionItem } from "dmb-api";
import http from "./http";

export const activity = {
    async getActivities() {
        return await http.get<ApiActivity[]>("api/Activity?expand=song/collection");
    },
    async pushActivities(activities: ApiActivity[]) {
        return await http.post<ApiActivity[]>("api/Activity", activities.map(a => {
            return {
                songId: a.songId,
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
    async getAllSongs(collection: string) {
        return (await http.get<ApiSong[]>(`api/Songs/${collection}?expand=participants/contributor,details,videoFiles/contributors,audioFiles/contributors,sheetMusic,themes,transpositions,copyright`)).map(s => new Song(s));
    },
    async getLyrics(collection: string, number: number, language: string, format: string, transpose: number, transcode: string) {
        return new Lyrics(await http.get<ApiLyrics>(`api/Lyrics/${collection}/${number}?language=${language}&format=${format}&transpose=${transpose}&transcode=${transcode}`));
    },
    async getAllLyrics(collection: string, language: string, format: string, transpose: number) {
        const uri = `api/Lyrics/${collection}?language=${language}&format=${format}&transpose=${transpose}`;
        return (await http.get<ApiLyrics[]>(uri)).map(l => new Lyrics(l));
    },
    async getContributor(id: string) {
        return new ContributorCollectionItem((await http.get<ApiContributorCollectionItem>(`api/Contributor/${id}?expand=contributor/biography,songs/collection`)));
    },
    async getAllContributors(collection: string) {
        return (await http.get<ApiContributorCollectionItem[]>(`api/Contributors/${collection}`)).map(c => new ContributorCollectionItem(c));
    },
    async getAllAuthors(collection: string) {
        return (await http.get<ApiContributorCollectionItem[]>(`api/Authors/${collection}`)).map(c => new ContributorCollectionItem(c));
    },
    async getAllComposers(collection: string) {
        return (await http.get<ApiContributorCollectionItem[]>(`api/Composers/${collection}`)).map(c => new ContributorCollectionItem(c));
    },
    async getAllThemes(collection: string) {
        return (await http.get<ApiThemeCollectionItem[]>(`api/Themes/${collection}`)).map(ci => new ThemeCollectionItem(ci));
    },
    async getAllCountries(collection: string) {
        return (await http.get<ApiCountryCollectionItem[]>(`api/Countries/${collection}`)).map(ci => new CountryCollectionItem(ci));
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
        return (await http.get<ApiPlaylist[]>("api/Playlists?expand=entries/item/collection"));
    },
    async getPlaylist(id: string) {
        return (await http.get<ApiPlaylist>("api/Playlists/" + id + "?expand=entries/item/collection"));
    },
    async createPlaylist(name: string) {
        return (await http.post("api/Playlists", {name})) as ApiPlaylist;
    },
    async deletePlaylist(id: string){
        return (await http.delete(`api/Playlists/${id}`));
    },
    async addToPlaylist(playlistId: string, fileId: string, type: string) {
        return (await http.post<ApiPlaylist>(`api/Playlists/${playlistId}/${type}/${fileId}?expand=entries/item/collection`));
    },
    async removeEntryFromPlaylist(playlistId: string, entryId: string) {
        return (await http.delete<ApiPlaylist>(`api/Playlists/${playlistId}/${entryId}?expand=entries/item/collection`));
    },
};

export const stripe = {
    setup() {
        return http.get<SetupResponse>("api/Store/Setup");
    },
    startSession(productId: string) {
        return http.post<RedirectToCheckoutOptions, SessionRequest>("api/Store/Session", {
            productId,
            cancelUrl: window.location.origin + "/dashboard",
            successUrl: window.location.origin + "/success",
        });
    },
    getSession(sessionId: string) {
        return http.get<RedirectToCheckoutOptions>(`api/Store/Session/${sessionId}`);
    },
    getPortalSession() {
        return http.get(`api/Store/Portal?returnUrl=${window.location.origin}/store`);
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
};

export default api;
