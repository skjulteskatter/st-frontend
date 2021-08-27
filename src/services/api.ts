import { CollectionItem, Lyrics } from "@/classes";
//import { CacheService } from "./cacheservice";
import { RedirectToCheckoutOptions } from "@stripe/stripe-js";
import { SessionRequest, SetupResponse } from "checkout";
import { ApiActivity, ApiCategory, ApiCollection, ApiCollectionItem, ApiContributor, ApiCopyright, ApiCountry, ApiGenre, ApiLyrics, ApiPlaylist, ApiPlaylistEntry, ApiSong, ApiTag, ApiTheme, IndexedContributor, IndexedSong, MediaFile, PublicUser, ShareKey } from "dmb-api";
import http from "./http";

export const activity = {
    async getActivities() {
        return await http.get<ApiActivity[]>("api/Activity?limit=20");
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
    saveProfile(options: {
        gender?: string;
        birthDay?: string;
        address?: {
            addressLine: string;
            secondaryAddressLine: string;
            zipCode: number;
            city: string;
            country: string;
        };
    }) {
        return http.patch<User>("api/Session/Profile", options);
    },
    acceptPrivacyPolicy() {
        return http.get("api/Session/AcceptPolicies?privacyPolicy=true");
    },
    acceptTermsOfService() {
        return http.get("api/Session/AcceptPolicies?termsAndConditions=true");
    },
    verifyEmail() {
        return http.get("api/Session/VerifyEmail");
    },
};

export const items = {
    getThemes() {
        return http.get<ApiTheme[]>("api/Themes");
    },
    getCountries() {
        return http.get<ApiCountry[]>("api/Countries");
    },
    getCopyrights() {
        return http.get<ApiCopyright[]>("api/Copyrights");
    },
    getCategories() {
        return http.get<ApiCategory[]>("api/SongTags");
    },
    getGenres() {
        return http.get<ApiGenre[]>("api/Genres");
    },
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
    getUsers(query: string) {
        return http.get<User[]>("api/Admin/Users?query=" + query);
    },
    getUser(uid: string) {
        return http.get<User>("api/Admin/User/" + uid);
    },
    createSubscription(uid: string, options: {
        collectionIds: string[];
        validTo: string;
    }) {
        return http.post<Subscription, unknown>(`api/Admin/User/${uid}/Subscriptions`, options);
    },
    deleteSubcription(uid: string, subscriptionId: string) {
        return http.delete(`api/Admin/User/${uid}/Subscriptions/${subscriptionId}`);  
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
    importFromLandax() {
        return http.get<string>("api/Admin/Import");
    },
    clearLandaxCache() {
        return http.get<string>("api/Admin/ClearCache/Landax");
    },
    sync() {
        return http.get<{ result: string }>("api/Admin/Sync");
    },
};

export const songs = {
    getSongById(songId: string, expand?: string) {
        return http.get<ApiSong>("api/Songs/Id/" + songId + (expand ? "?expand=" + expand : ""));
    },
    getCollections() {
        return http.get<ApiCollection[]>("api/Collections");
    },
    getAllSongs(collectionIds: string[], lastUpdated?: string) {
        return http.getWithResult<ApiSong[]>(`api/Songs?collections=${collectionIds.join(",")}&expand=details,transpositions` + (lastUpdated && new Date(lastUpdated) > new Date("2021-01-01")  ? "&updatedAt=" + lastUpdated : ""));
    },
    getFiles(collectionIds: string[], lastUpdated?: string) {
        return http.getWithResult<MediaFile[]>(`api/Files?collections=${collectionIds.join(",")}` + (lastUpdated && new Date(lastUpdated) > new Date("2021-01-01") ? "&updatedAt=" + lastUpdated : ""));
    },
    getFile(fileId: string) {
        return http.get<MediaFile>(`api/Files/${fileId}?expand=song`);
    },
    getSongFiles(songId: string) {
        return http.get<MediaFile[]>(`api/Files?songId=${songId}&type=sheetmusic-pdf`);
    },
    async getLyrics(collection: ApiCollection, number: number, language: string, format: string, transpose: number, transcode: string, newMelody = false) {
        return new Lyrics(await http.get<ApiLyrics>(`api/Lyrics/${collection.id}/${number}?language=${language}&format=${format}&transpose=${transpose}&transcode=${transcode}&newMelody=${newMelody}`));
    },
    async getAllLyrics(collection: ApiCollection, language: string, format: string, transpose: number, lastUpdated?: string) {
        const uri = `api/Lyrics/${collection.id}?language=${language}&format=${format}&transpose=${transpose}` + (lastUpdated ? `&updatedAt=${lastUpdated}` : "");
        return (await http.get<ApiLyrics[]>(uri)).map(l => new Lyrics(l));
    },
    async getContributor(id: string) {
        return new CollectionItem((await http.get<ApiCollectionItem<ApiContributor>>(`api/Contributor/${id}?expand=item/biography,songs/collection`)));
    },
    getContributors(lastUpdated?: string) {
        return http.getWithResult<ApiCollectionItem<ApiContributor>[]>("api/Contributors" + (lastUpdated && new Date(lastUpdated) > new Date("2021-01-01")  ? "?updatedAt=" + lastUpdated : ""));
    },
    searchCollections(query: string, collectionId?: string) {
        return http.post<(IndexedSong | IndexedContributor)[], unknown>("api/Songs/Search", {query, collectionId});
    },
    creditSong(collectionId: string, number: number, language: string, content: string) {
        return http.uploadAndDownload(`api/Songs/Credit?collectionId=${collectionId}&number=${number}&language=${language}`, content);
    },
};

export const playlists = {
    async getPlaylists() {
        return (await http.get<ApiPlaylist[]>("api/Playlists"));
    },
    async getPlaylist(id: string) {
        return (await http.get<ApiPlaylist>("api/Playlists/" + id));
    },
    async createPlaylist(name: string) {
        return await http.post<ApiPlaylist, unknown>("api/Playlists", {name});
    },
    deletePlaylist(id: string): Promise<void> {
        return http.delete(`api/Playlists/${id}`);
    },
    async addToPlaylist(playlistId: string, songId: string, transposition?: number) {
        return await http.post<ApiPlaylistEntry[], unknown>(`api/Playlists/${playlistId}`, {
            songIds: [songId],
            transposition,
        });
    },
    async removeEntryFromPlaylist(playlistId: string, entryId: string) {
        return (await http.post<ApiPlaylist, unknown>(`api/Playlists/${playlistId}`, {
            removeEntryIds: [entryId],
        }));
    },
    getUsers(playlistId: string) {
        return http.get<PublicUser[]>("api/Playlists/" + playlistId + "/Users");
    },
    deleteUser(playlistId: string, userId: string) {
        return http.delete(`api/Playlists/${playlistId}/Users/${userId}`);
    },
    updatePlaylist(playlistId: string, options: {
        name?: string;
        entryOrder?: string[];
    }) {
        return http.patch(`api/Playlists/${playlistId}`, options);
    },
};

export const sharing = {
    getKeys() {
        return http.get<ShareKey[]>("api/Sharing");
    },
    shareItem(itemId: string, type: "playlist" | "tag") {
        return http.put<ShareKey, unknown>("api/Sharing", {
            itemId,
            type,
        });
    },
    deleteKey(key: string) {
        return http.delete("api/Sharing/" + key);
    },
    activateKey(key: string) {
        return http.post<ApiPlaylist | ApiTag>("api/Sharing/" + key);
    },
};

export const analytics = {
    getForSong(songId: string, fromDate: Date, toDate?: Date) {
        return http.get<AnalyticsItem>("api/Analytics/" + songId + `?fromDate=${fromDate.toISOString()}` + (toDate ? `&toDate=${toDate?.toISOString()}` : ""));
    },
    viewSong(songId: string) {
        return http.post<number>("api/Analytics/View/" + songId);
    },
    getMostViewed() {
        return http.get<{[key: string]: number}>("api/Analytics/MostViewed");
    },
    getTotalViews() {
        return http.get<{[key: string]: number}>("api/Analytics/Views");
    },
};

export const tags = {
    getAll() {
        return http.get<ApiTag[]>("api/Tags");
    },
    get(id: string) {
        return http.get<ApiTag>("api/Tags/" + id);
    },
    create(name: string, color: string, songId: string) {
        return http.post<ApiTag, unknown>("api/Tags", {name, color, songId});
    },
    update(id: string, name?: string, color?: string) {
        return http.patch("api/Tags/" + id, {
            name,
            color,
        });
    },
    delete(id: string){
        return http.delete(`api/Tags/${id}`);
    },
    addToTag(id: string, songId: string) {
        return http.post<ApiTag>(`api/Tags/${id}/${songId}`);
    },
    removeFromTag(id: string, songId: string) {
        return http.delete<ApiTag>(`api/Tags/${id}/${songId}`);
    },
};

export const stripe = {
    setup() {
        return http.get<SetupResponse>("api/Store/Setup");
    },
    async startSession(productIds: string[], type: "year" | "month") {
        const country = await http.getCountry().catch(() => {
            return undefined;
        });

        return await http.post<RedirectToCheckoutOptions, SessionRequest>("api/Store/Session", {
            productIds,
            cancelUrl: window.location.href,
            successUrl: window.location.origin + "/success",
            country,
            type,
        });
    },
    getSession(sessionId: string) {
        return http.get<RedirectToCheckoutOptions>(`api/Store/Session/${sessionId}`);
    },
    getPortalSession() {
        return http.post("api/Store/Portal", {
            returnUrl: window.location.href,
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
    analytics,
};

export default api;
