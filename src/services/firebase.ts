import firebase from 'firebase/app'
import 'firebase/auth'

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

firebase.initializeApp(firebaseConfig)

class Firebase {
    public currentUser: firebase.User | null = null

    public async loginGoogle () {
        firebase.auth().setPersistence('local')

        const provider = new firebase.auth.GoogleAuthProvider()

        this.currentUser = firebase.auth().currentUser

        if (this.currentUser == null) {
            await firebase.auth().signInWithPopup(provider).catch(err => {
                console.log(err)
            })
            this.currentUser = firebase.auth().currentUser
        }

        if (this.currentUser == null) throw new Error('User not validated...')

        const token = await this.currentUser.getIdToken()

        if (typeof token === 'string') return token
    }
}

export default Firebase
