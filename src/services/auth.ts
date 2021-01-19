import firebase from './firebase'

class Auth {
    public accessToken = ''
    public expiresAt = 0

    public setToken(token: string) {
        if (token !== '') {
            this.accessToken = token;
            localStorage.setItem('id_token', token);
            this.expiresAt = 3600 * 1000 + new Date().getTime();
            localStorage.setItem('id_expires_at', `${this.expiresAt}`);
        }
    }

    public async init() {
        this.setToken(await firebase.init());
    }

    public async login(providerName?: string) {
        this.setToken(await firebase.socialLogin(providerName));
    }

    public async loginEmail(email: string, password: string, stayLoggedIn: boolean) {
        this.setToken(await firebase.emailPassword(email, password, stayLoggedIn));
    }

    public async getToken() {
        if (this.token) return this.token;
        this.setToken(await firebase.getToken() ?? '');
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
            parseInt(window.localStorage.getItem('id_expires_at') || '0');
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
