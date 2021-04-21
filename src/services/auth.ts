/* eslint-disable no-console */
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/performance";
import { firebaseConfig } from "@/config";
import router from "@/router";
import api from "./api";
import { useStore } from "@/store";
import { SessionActionTypes } from "@/store/modules/session/action-types";
import { SessionMutationTypes } from "@/store/modules/session/mutation-types";
import { notify } from "./notify";

const store = useStore();

function notInitialized() {
    throw Error("FIREBASE DID NOT INITIALIZE");
}

function invalidProvider() {
    throw Error("INVALID PROVIDER");
}

function notLoggedIn() {
    router.push({name: "login"});
    throw Error("NOT LOGGED IN");
}

firebase.initializeApp(firebaseConfig);

const a = firebase.auth;

firebase.performance();

if (!a) {
    notInitialized();
}

async function loginUser(auth: Auth, user: firebase.User): Promise<boolean> {
    if (user.emailVerified) {
        store?.commit(SessionMutationTypes.ERROR, "");
        return true;
    } else {
        store?.commit(SessionMutationTypes.ERROR, "EMAIL_NOT_VERIFIED");
        router.push({name: "verify-email"});
        return false;
    }
}

const providers: {
    [key: string]: firebase.auth.AuthProvider;
} = {
    google: new a.GoogleAuthProvider(),
    twitter: new a.TwitterAuthProvider(),
    microsoft: (() => {
        const p = new a.OAuthProvider("microsoft.com");
        p.setCustomParameters({
            prompt: "consent",
        });
        return p;
    })(),
    facebook: new a.FacebookAuthProvider(),
    apple: (() => {
        const p = new a.OAuthProvider("apple.com");
        p.addScope("email");
        p.addScope("name");

        return p;
    })(),
};

class Auth {
    private accessToken = "";
    private expiresAt = 0;
    
    public get emailVerified() {
        return a().currentUser?.emailVerified == true;
    }

    public get image() {
        return a().currentUser?.photoURL ?? "";
    }

    public verificationEmailSent = false;

    public async getProviders(email: string) {
        return await a().fetchSignInMethodsForEmail(email);
    }

    public async setDisplayName(name: string) {
        if (!a) {
            notInitialized();
        }
        await a().currentUser?.updateProfile({
            displayName: name,
        });
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
            await loginUser(this, user);
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
            .signInWithEmailAndPassword(email, password)
            .catch(e => {
                switch (e.code) {
                case "auth/wrong-password":
                    notify("error", "Wrong Password", "warning");
                    store.commit(SessionMutationTypes.ERROR, "Wrong password");
                    break;
                default:
                    break;
                }
                return;
            }) as firebase.auth.UserCredential;

        const user = result.user;

        if (user) {
            await loginUser(this, user);
        }
    }

    public async createEmailAndPasswordUser(email: string, password: string, displayName: string) {
        if (!a) {
            notInitialized();
        }

        // const methods = await a().fetchSignInMethodsForEmail(email);

        const result = await a()
            .createUserWithEmailAndPassword(email, password)
            .catch(e => {
                switch (e.code) {
                case "auth/email-already-in-use": 
                    console.log("email in use");

                    console.log(a().currentUser);
                    break;
                default:
                    console.log(e.code);
                }
            });
        if (!result) return;

        const user = result.user;

        await user?.updateProfile({
            displayName,
        });

        if (user) {
            await this.sendLinkToEmail();
            return "VERIFICATION_EMAIL_SENT";
        }
        return "FAILED_SIGNIN";
    }

    public async resetPassword(oldPassword: string, password: string) {
        const user = a().currentUser;

        if (user) {
            try {
                await user.updatePassword(password);

                //console.log("updated password");
            }
            catch (e) {
                console.log(e);
                if (!user.email) throw new Error("No email found on account ???");

                await a().signInWithEmailAndPassword(user.email, oldPassword);

                await user.updatePassword(password);
            }
        }
    }

    public async sendLinkToEmail() {
        const user = a().currentUser;

        if (user) {
            await user.sendEmailVerification({
                handleCodeInApp: true,
                url: window.origin,
            });
            this.verificationEmailSent = true;
            router.push({name: "verify-email"});
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
            return "VERIFIED_EMAIL";
        }
        return "CODE_NOT_VALID";
    }

    public get isAuthenticated() {
        const user = a().currentUser;
        if (user?.emailVerified) {
            return true;
        }
        return false;
    }

    public async getToken() {
        const user = a().currentUser;
        if (user?.emailVerified) {
            const token = await user.getIdToken();
            localStorage.setItem("id_token", token);
            return token;
        }
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

    public get user() {
        return a()?.currentUser;
    }

    // public renderUi() {
    //     // eslint-disable-next-line @typescript-eslint/no-var-requires
    //     const firebaseui = require('firebaseui');

    //     const ui = new firebaseui.auth.AuthUI(a());

    //     ui.start('#firebase-auth-container', {
    //         signInOptions: [
    //             a.EmailAuthProvider.PROVIDER_ID,
    //             a.GoogleAuthProvider.PROVIDER_ID,
    //             a.FacebookAuthProvider.PROVIDER_ID,
    //         ],
    //         signInSuccessUrl: '/'
    //     })
    // }
}

const auth = new Auth();

a().onAuthStateChanged(async s => {
    if (s) {
        await useStore().dispatch(SessionActionTypes.SESSION_START);
    }
    useStore().commit(SessionMutationTypes.INITIALIZED);
});

export default auth;
