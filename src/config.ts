export const firebaseConfig = {
    apiKey: "AIzaSyDTZsQJxCT3w7cIQzYJ6T3YxNLIF-2LEpk",
    authDomain: "songtreasures.app",
    projectId: "songtreasures",
    storageBucket: "songtreasures.appspot.com",
    messagingSenderId: "721098499416",
    appId: "1:721098499416:web:fc3d22660728b82e82f12d",
    measurementId: "G-YWMEW6TKB8",
};

const basePath = "https://songtreasures.azurewebsites.net/";

const config = {
    api: {
        basePath,
    },
    firebaseConfig,
};

if (process.env.NODE_ENV === "development") {
    const savedBasePath = localStorage.getItem("api_base_path");
    if (savedBasePath) {
        const div = document.createElement("div");
        div.innerText = "LOCAL";
        div.style.position = "fixed";
        div.style.bottom = "10px";
        div.style.zIndex = "10000";
        div.style.fontSize = "30px";
        window.document.body.appendChild(div);
        config.api.basePath = savedBasePath;
    }

    const localBasePath = "https://localhost:44301/";

    const keyPresses = {
        L: false,
        CTRL: false,
    };

    const setBasePath = () => {
        if (savedBasePath !== localBasePath) {
            localStorage.setItem("api_base_path", localBasePath);
        } else {
            localStorage.removeItem("api_base_path");
        }
        window.location.reload();
    };

    window.addEventListener("keydown", (event) => {
        if (event.key === "l") {
            keyPresses.L = true;
            if (keyPresses.CTRL) {
                setBasePath();
            }
        } else if (event.key === "Control") {
            keyPresses.CTRL = true;
            if (keyPresses.L) {
                setBasePath();
            }
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.key === "l") {
            keyPresses.L = false;
        } else if (event.key === "Control") {
            keyPresses.CTRL = false;
        }
    });
}

export default config;
