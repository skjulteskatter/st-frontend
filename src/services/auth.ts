import firebase from 'firebase/app'; 
import 'firebase/auth';
import { firebaseConfig } from '@/config';
import { sessionStore } from '@/store';

function notInitialized() {
    throw Error('FIREBASE DID NOT INITIALIZE');
}

function invalidProvider() {
    throw Error('INVALID PROVIDER');
}

function notLoggedIn() {
    throw Error('NOT LOGGED IN');
}

firebase.initializeApp(firebaseConfig);

const a = firebase.auth;

if (!a) {
    notInitialized();
}

async function loginUser(auth: Auth, user: firebase.User): Promise<boolean> {
    if (user.emailVerified) {
        auth.setToken(
            await user.getIdToken()
        );
        sessionStore.commit('error', '');
        return true;
    } else {
        sessionStore.commit('error', 'EMAIL_NOT_VERIFIED');
        return false;
    }
}


const providers: {
    [key: string]: firebase.auth.AuthProvider;
} = {
    google: new a.GoogleAuthProvider(),
    twitter: new a.TwitterAuthProvider(),
    microsoft: (() => {
        const p = new a.OAuthProvider('microsoft');
        p.setCustomParameters({
            prompt: 'consent'
        });
        return p;
    })(),
    facebook: new a.FacebookAuthProvider(),
}

class Auth {
    public accessToken = '';
    public expiresAt = 0;
    public initing = false;

    public setToken(token: string) {
        if (token !== '') {
            this.accessToken = token;
            localStorage.setItem('id_token', token);
            this.expiresAt = 3600 * 1000 + new Date().getTime();
            localStorage.setItem('id_expires_at', `${this.expiresAt}`);
        }
    }

    public async login(providerName: string) {
        if (!a) {
            notInitialized();
        }
        await a().setPersistence(a.Auth.Persistence.LOCAL);

        const provider = providers[providerName];

        if (!provider) {
            invalidProvider();
        }

        const result = await a()
            .signInWithPopup(provider);
        
        const user = result.user;

        if (user) {
            if (!await loginUser(this, user)) {
                await this.sendLinkToEmail();
            }
        }
    }

    public async loginWithEmailAndPassword(email: string, password: string, stayLoggedIn: boolean) {
        if (!a) {
            notInitialized();
        }
        if (stayLoggedIn) {
            await a().setPersistence(a.Auth.Persistence.LOCAL);
        } else {
            await a().setPersistence(a.Auth.Persistence.SESSION);
        }

        const result = await a()
            .signInWithEmailAndPassword(email, password);

        const user = result.user;

        if (user) {
            if (!await loginUser(this, user)) {
                await this.sendLinkToEmail();
            }
        }
    }

    public async createEmailAndPasswordUser(email: string, password: string) {
        if (!a) {
            notInitialized();
        }

        const result = await a()
            .createUserWithEmailAndPassword(email, password);
        
        const user = result.user;

        if (user) {
            await this.sendLinkToEmail();
            return 'VERIFICATION_EMAIL_SENT';
        }
        return 'FAILED_SIGNIN';
    }

    public async sendLinkToEmail() {
        const user = a().currentUser;

        if (user) {
            await user.sendEmailVerification({
                handleCodeInApp: true,
                url: window.origin,
            });
        } else {
            notLoggedIn();
        }
    }

    public async logout() {
        await a().signOut();
        localStorage.clear();
    }

    public async verificationCode(code: string) {
        await a().applyActionCode(code);

        const user = a().currentUser;

        if (user?.emailVerified) {
            this.setToken(
                await user.getIdToken()
            );
            return 'VERIFIED_EMAIL';
        }
        return 'CODE_NOT_VALID';
    }

    public get isAuthenticated() {
        this.accessToken = this.accessToken || localStorage.getItem('id_token') || '';
        if (!this.accessToken) {
            return false;
        }
        const expiresAt = this.expiresAt || localStorage.getItem('id_expires_at') || '';
        const authenticated = new Date().getTime() < expiresAt;
        return authenticated;
    }

    public get token() {
        const expires =
            this.expiresAt ||
            parseInt(localStorage.getItem('id_expires_at') || '0');
        if (expires > Date.now()) {
            const accessToken =
                this.accessToken ||
                localStorage.getItem('id_token');
            if (accessToken) {
                return accessToken;
            }
        }
        return null;
    }

    public async getToken() {
        if (this.token) return this.token;
        if (a().currentUser?.emailVerified) return await a().currentUser?.getIdToken();
        return null;
    }
}

const auth = new Auth()

a().onAuthStateChanged(async s => {
    if (s) {
        auth.setToken(await s.getIdToken());
        await sessionStore.dispatch('startSession');
    }
    sessionStore.commit('initialized', true);
});

export default auth;
