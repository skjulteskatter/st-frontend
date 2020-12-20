import auth from './auth'
import http from './http'

export const session = {
    async login () {
        return await auth.login()
    },
    async getCurrentUser () {
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

const api = {
    session,
    admin
}

export default api
