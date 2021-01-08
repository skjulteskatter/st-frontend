import { Song, Lyrics } from '../classes';
import auth from './auth';
import http from './http';

export const session = {
    async login() {
        return await auth.login()
    },
    async getCurrentUser() {
        return await http.get<User>('api/Session')
    },
    isAuthenticated: auth.isAuthenticated,
    async startSession() {
        return await auth.login();
    },
}

export const admin = {
    async getAllSubscriptions() {
        return await http.get<Subscription[]>('api/Admin/Subscriptions')
    },
    getAllUsers() {
        return http.get<User[]>('api/Admin/Users')
    }
}

export const songs = {
    getCollections() {
        return http.get<Collection[]>('api/Collections');
    },
    getAllSongs(collection: string) {
        return http.get<Song[]>(`api/Songs/${collection}`);
    },
    getLyrics(collection: string, number: number, language: string, format: string, transpose: number) {
        return http.get<Lyrics>(`api/Lyrics/${collection}/${number}?language=${language}&format=${format}&transpose=${transpose}`);
    },
    getAllLyrics(collection: string, language: string, format: string, transpose: number) {
        return http.get<Lyrics>(`api/Lyrics/${collection}?language=${language}&format=${format}&transpose=${transpose}`);
    }
}

const api = {
    session,
    admin,
    songs,
}

export default api
