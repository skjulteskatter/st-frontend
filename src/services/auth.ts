import firebase from 'firebase/app'; 
import 'firebase/auth';
import { firebaseConfig } from '@/config';
import { sessionStore } from '@/store';
import router from '@/router';
import api from './api';

function notInitialized() {
    throw Error('FIREBASE DID NOT INITIALIZE');
}

function invalidProvider() {
    throw Error('INVALID PROVIDER');
}

function notLoggedIn() {
    router.push({name: 'login'});
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
        router.push({name: 'verify-email'});
        return false;
    }
}


const providers: {
    [key: string]: firebase.auth.AuthProvider;
} = {
    google: new a.GoogleAuthProvider(),
    twitter: new a.TwitterAuthProvider(),
    microsoft: (() => {
        const p = new a.OAuthProvider('microsoft.com');
        p.setCustomParameters({
            prompt: 'consent'
        });
        return p;
    })(),
    facebook: new a.FacebookAuthProvider(),
}

class Auth {
    private accessToken = '';
    private expiresAt = 0;
    
    public get emailVerified() {
        return a().currentUser?.emailVerified == true;
    }

    public get image() {
        return a().currentUser?.photoURL ?? '';
    }

    public verificationEmailSent = false;

    public async setDisplayName(name: string) {
        if (!a) {
            notInitialized();
        }
        await a().currentUser?.updateProfile({
            displayName: name,
        });
    }

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
            await loginUser(this, user)
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
            await loginUser(this, user);
        }
    }

    public async createEmailAndPasswordUser(email: string, password: string, displayName: string) {
        if (!a) {
            notInitialized();
        }

        const result = await a()
            .createUserWithEmailAndPassword(email, password);
        
        const user = result.user;

        await user?.updateProfile({
            displayName
        });

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
            this.verificationEmailSent = true;
        } else {
            notLoggedIn();
        }
        router.push({name: 'verify-email'});
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
        if (!this.accessToken || !this.emailVerified) {
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
        return undefined;
    }

    public async getToken() {
        let token = this.token;
        if (!token) {
            token = this.emailVerified ? await a().currentUser?.getIdToken() : undefined;
        }
        return token;
    }

    public async setProfileImage(fileName: string, image: string) {
        if (!a) {
            notInitialized();
        }

        const url = await api.session.uploadImage(fileName, image);

        if (url) {
            await a().currentUser?.updateProfile({
                photoURL: url.image,
            });
        }
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
