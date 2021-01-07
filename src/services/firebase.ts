import { sessionStore } from '@/store';
import fb from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyC6b3XqiSM6uBuDq23THGzIWj6OgIogB_U',
    authDomain: 'landax-music-app.firebaseapp.com',
    databaseURL: 'https://landax-music-app.firebaseio.com',
    projectId: 'landax-music-app',
    storageBucket: 'landax-music-app.appspot.com',
    messagingSenderId: '230724783358',
    appId: '1:230724783358:web:2642da04c8647c75e6a9af',
    measurementId: 'G-PP8F4ZZ3M0'
}

fb.initializeApp(firebaseConfig)


class Firebase {
    public currentUser: fb.User | null = null

    private getProvider(name = "google") {
        switch(name) {
            case "facebook":
                return new fb.auth.FacebookAuthProvider();
            case "google":
            default:
                return new fb.auth.GoogleAuthProvider();
        }
    }

    public async socialLogin (providerName?: string, stayLoggedIn?: boolean) {
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
        await sessionStore.dispatch('initSongService');
    }
})

export default firebase;
