import auth from './auth'
import http from './http'

export const session = {
    async login () {
        return await auth.login()
    },
    async getCurrentUser () {
        return await http.get<User>('api/Session')
    },
    isAuthenticated: auth.isAuthenticated
}

const api = {
    session
}

export default api
