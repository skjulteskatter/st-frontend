import { RedirectToCheckoutOptions } from '@stripe/stripe-js';
import { SessionRequest, SetupResponse } from 'checkout';
import auth from './auth';
import http from './http';

export const session = {
    async getCurrentUser() {
        return await http.get<User>('api/Session')
    },
    isAuthenticated: auth.isAuthenticated,
    saveUser(settings: UserSettings) {
        return http.patch('api/Session', settings)
    },
    createUser(displayName: string) {
        return http.put('api/Session', {displayName});
    },
    uploadImage(fileName: string, base64Image: string) {
        return http.patch<{image: string}>('api/Session/Image', {fileName, base64Image});
    }
}

export const items = {
    getLanguages() {
        return http.get<Language[]>('api/Languages');
    }
}

export const admin = {
    async getAllSubscriptions() {
        return await http.get<Subscription[]>('api/Admin/Subscriptions');
    },
    getAllUsers() {
        return http.get<User[]>('api/Admin/Users');
    },
    getRoles() {
        return http.get<string[]>('api/Admin/Roles');
    },
    setRoles(user: User, roles: string[]) {
        return http.patch<User>(`api/Admin/User/${user.id}/Roles`, roles);
    },
    clearCache(collectionId: string) {
        return http.get<void>(`api/Admin/ClearCache/${collectionId}`);
    },
    sync(collectionId: string) {
        return http.get<void>(`api/Admin/Sync/${collectionId}`);
    }
}

export const songs = {
    getCollections() {
        return http.get<CollectionInterface[]>('api/Collections');
    },
    getAllSongs(collection: string) {
        return http.get<SongInterface[]>(`api/Songs/${collection}?expand=composers,authors,details,videoFiles/contributors,audioFiles/contributors,sheetMusic,themes,transpositions`);
    },
    getLyrics(collection: string, number: number, language: string, format: string, transpose: number) {
        return http.get<LyricsInterface>(`api/Lyrics/${collection}/${number}?language=${language}&format=${format}&transpose=${transpose}`);
    },
    getAllLyrics(collection: string, language: string, format: string, transpose: number) {
        return http.get<LyricsInterface[]>(`api/Lyrics/${collection}?language=${language}&format=${format}&transpose=${transpose}`);
    },
    getAuthor(collection: string, id: string) {
        return http.get<ContributorInterface>(`api/Author/${collection}/${id}`);
    },
    getComposer(collection: string, id: string) {
        return http.get<ContributorInterface>(`api/Composer/${collection}/${id}`);
    },
    getContributor(id: string) {
        return http.get<ContributorCollectionItem>(`api/Contributor/${id}?expand=contributor/biography,songs/collection`);
    },
    getAllContributors(collection: string) {
        return http.get<ContributorCollectionItem[]>(`api/Contributors/${collection}`);
    },
    getAllAuthors(collection: string) {
        return http.get<ContributorCollectionItem[]>(`api/Authors/${collection}`);
    },
    getAllComposers(collection: string) {
        return http.get<ContributorCollectionItem[]>(`api/Composers/${collection}`);
    },
    getAllThemes(collection: string) {
        return http.get<ThemeCollectionItem[]>(`api/Themes/${collection}`);
    },
    getAllCountries(collection: string) {
        return http.get<CountryCollectionItem[]>(`api/Countries/${collection}`);
    },
    searchCollections(search: string, language: string) {
        return http.get<SongInterface[]>(`api/Songs/Search/${search}?language=${language}&expand=collection,authors,composers`);
    }
}

export const stripe = {
    setup() {
        return http.get<SetupResponse>('api/Store/Setup')
    },
    startSession(priceId: string) {
        return http.post<RedirectToCheckoutOptions, SessionRequest>(`api/Store/Session`, { 
            priceId,
            cancelUrl: window.location.origin + "/dashboard",
            successUrl: window.location.origin + "/success",
        });
    },
    getSession(sessionId: string) {
        return http.get<RedirectToCheckoutOptions>(`api/Store/Session/${sessionId}`)
    },
    getPortalSession() {
        return http.get(`api/Store/Portal?returnUrl=${window.location.origin}/store`);
    },
    refreshSubscriptions() {
        return http.get(`api/Store/Refresh`);
    }
}

const api = {
    session,
    admin,
    songs,
    items,
    stripe,
}

export default api
