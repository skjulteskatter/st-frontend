import firebase from './firebase'

class Auth {
    public accessToken = ''
    public expiresAt = 0

    public async login(providerName?: string, stayLoggedIn?: boolean) {
        this.accessToken = await firebase.socialLogin(providerName, stayLoggedIn);

        if (this.accessToken !== '') {
            localStorage.setItem('id_token', this.accessToken)
            this.expiresAt = 3600 * 1000 + new Date().getTime()
            localStorage.setItem('id_expires_at', `${this.expiresAt}`)
        }
    }

    public async loginEmail(email: string, password: string, stayLoggedIn: boolean) {
        this.accessToken = await firebase.emailPassword(email, password, stayLoggedIn);

        if (this.accessToken !== '') {
            localStorage.setItem('id_token', this.accessToken)
            this.expiresAt = 3600 * 1000 + new Date().getTime()
            localStorage.setItem('id_expires_at', `${this.expiresAt}`)
        }
    }

    public get isAuthenticated() {
        this.accessToken = this.accessToken || localStorage.getItem('id_token') || ''
        if (!this.accessToken) {
            return false
        }

        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = this.expiresAt || window.localStorage.getItem('id_expires_at') || ''
        const authenticated = new Date().getTime() < expiresAt
        return authenticated
    }

    public get token() {
        const expires =
            this.expiresAt ||
            parseInt(window.localStorage.getItem('id_expires_at') || '0')
        if (expires > Date.now()) {
            const accessToken =
                this.accessToken ||
                window.localStorage.getItem('id_token')
            if (accessToken) {
                return accessToken
            }
        }
        return null
    }
}

const auth = new Auth()

export default auth
