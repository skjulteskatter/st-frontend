import { sessionStore, songStore } from '@/store';
import fb from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from '@/config';

fb.initializeApp(firebaseConfig);

const providers: {
    [provider: string]: fb.auth.AuthProvider;
} = {
    google: new fb.auth.GoogleAuthProvider(),
    facebook: new fb.auth.FacebookAuthProvider(),
};

class Firebase {
    public currentUser: fb.User | null = null

    private getProvider(name = "google"): fb.auth.AuthProvider {
        return providers[name];
    }

    public async socialLogin(providerName?: string, stayLoggedIn?: boolean) {
        if (stayLoggedIn) await fb.auth().setPersistence(fb.auth.Auth.Persistence.LOCAL);

        if (this.currentUser) return await this.currentUser.getIdToken();

        let user = fb.auth().currentUser;

        if (user) return await user.getIdToken();

        const provider = this.getProvider(providerName);

        await fb.auth().signInWithPopup(provider);

        user = fb.auth().currentUser;

        if (user == null) throw new Error('User not validated...')

        return await user.getIdToken();
    }
}

const firebase = new Firebase();

fb.auth().onAuthStateChanged(async s => {
    firebase.currentUser = s?.uid !== null ? s : null;

    if (firebase.currentUser) {
        await sessionStore.dispatch('socialLogin', true);
        await songStore.dispatch('initSongService');
    }
})

export default firebase;
