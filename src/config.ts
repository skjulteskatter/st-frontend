let basePath = 'https://app.songtreasures.org/'

if (process.env.NODE_ENV == "development") {
    basePath = 'https://app.songtreasures.org/';
}

export const firebaseConfig = {
    apiKey: 'AIzaSyC6b3XqiSM6uBuDq23THGzIWj6OgIogB_U',
    authDomain: 'login.songtreasure.app',
    projectId: 'landax-music-app',
    storageBucket: 'landax-music-app.appspot.com',
    messagingSenderId: '230724783358',
    appId: '1:230724783358:web:2642da04c8647c75e6a9af',
    measurementId: 'G-PP8F4ZZ3M0',
};

export default {
    api: {
        basePath: basePath
    },
    firebaseConfig,
};
