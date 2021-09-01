let basePath = "https://songtreasures.azurewebsites.net/";

if (process.env.NODE_ENV == "development") {
    basePath = 
    // "https://localhost:44301/";
    "https://songtreasures.azurewebsites.net/";
}

export const firebaseConfig = {
    apiKey: "AIzaSyDTZsQJxCT3w7cIQzYJ6T3YxNLIF-2LEpk",
    authDomain: "songtreasures.firebaseapp.com",
    projectId: "songtreasures",
    storageBucket: "songtreasures.appspot.com",
    messagingSenderId: "721098499416",
    appId: "1:721098499416:web:fc3d22660728b82e82f12d",
    measurementId: "G-YWMEW6TKB8",
};

// export const firebaseConfig = {
//     apiKey: "AIzaSyC6b3XqiSM6uBuDq23THGzIWj6OgIogB_U",
//     authDomain: "songtreasure.app",
//     projectId: "landax-music-app",
//     messagingSenderId: "230724783358",
//     appId: "1:230724783358:web:2642da04c8647c75e6a9af",
//     measurementId: "G-PP8F4ZZ3M0",
// };

export default {
    api: {
        basePath: basePath,
    },
    firebaseConfig,
};
