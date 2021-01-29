/* eslint-disable @typescript-eslint/no-explicit-any */
import { sessionStore, songStore } from '@/store';
import fb from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from '@/config';

fb.initializeApp(firebaseConfig);

if (fb.auth == null) {
    throw new Error("Firebase didn't initialize");
}

const providers: {
    [provider: string]: fb.auth.AuthProvider;
} = {
    google: new fb.auth.GoogleAuthProvider(),
    facebook: new fb.auth.FacebookAuthProvider(),
    twitter: new fb.auth.TwitterAuthProvider(),
    microsoft: (() => {
        const p = new fb.auth.OAuthProvider('microsoft.com');
        p.setCustomParameters({
            prompt: 'consent'
        });
        return p;
    })(),
};

class FirebaseService {
    public currentUser?: fb.User = undefined;

    private getProvider(name = "google"): any {
        return providers[name];
    }

    public async socialLogin(providerName?: string) {
        if (fb.auth == null) {
            throw new Error("Firebase didn't initialize");
        }
        await fb.auth().setPersistence(fb.auth.Auth.Persistence.LOCAL)

        if (this.currentUser) return await this.currentUser.getIdToken();

        let user = fb.auth().currentUser;

        if (user) return await user.getIdToken();

        await fb.auth().signInWithPopup(this.getProvider(providerName));

        user = fb.auth().currentUser;

        if (user == null) throw new Error('User not validated...')

        if (user.email) {
            // fb.auth().sendSignInLinkToEmail(user.email, {
            //     url
            // });
        }

        return await user.getIdToken();
    }

    public async emailPassword(email: string, password: string, stayLoggedIn = false) {
        if (fb.auth == null) {
            throw new Error("Firebase didn't initialize");
        }
        if (stayLoggedIn) {
            await fb.auth().setPersistence(fb.auth.Auth.Persistence.LOCAL)
        } else {
            await fb.auth().setPersistence(fb.auth.Auth.Persistence.SESSION)
        }

        if (this.currentUser) return await this.currentUser.getIdToken();

        let user = fb.auth().currentUser;

        if (user) return await user.getIdToken();

        const result = await fb.auth().signInWithEmailAndPassword(email, password);

        user = result.user;

        if (!user) throw new Error('User not validated...')

        return await user.getIdToken();
    }

    public async createUserWithEmailPassword(email: string, password: string): Promise<string> {
        const user = await fb.auth().createUserWithEmailAndPassword(email, password);

        if (!user.user) {
            throw new Error("User is not defined");
        }

        return user.user.getIdToken();
    }

    public async init(): Promise<string> {
        if (fb.auth == null) {
            throw new Error("Firebase didn't initialize");
        }
        const user = fb.auth().currentUser;

        if (!user) throw new Error('User doesn\'t exist');

        return user.getIdToken();
    }

    public signOut() {
        if (fb.auth == null) {
            throw new Error("Firebase didn't initialize");
        }
        fb.auth().signOut();
    }

    public getToken() {
        return this.currentUser?.getIdToken();
    }
}

const firebase = new FirebaseService();

fb.auth().onAuthStateChanged(async s => {
    firebase.currentUser = s?.uid ? s : undefined;

    
    if (firebase.currentUser) {
        sessionStore.commit('authInitialized', true)
        await sessionStore.dispatch('initialize');

        await songStore.dispatch('initSongService');
    } else {
        sessionStore.commit('authInitialized', false)
    }
})

export default firebase;
