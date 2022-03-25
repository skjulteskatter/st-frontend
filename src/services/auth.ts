/* eslint-disable no-console */
import { initializeApp } from "firebase/app";
import { 
    applyActionCode,
    AuthProvider, 
    browserLocalPersistence, 
    browserSessionPersistence, 
    createUserWithEmailAndPassword, 
    FacebookAuthProvider, 
    fetchSignInMethodsForEmail, 
    getAuth, 
    GoogleAuthProvider, 
    OAuthProvider, 
    onAuthStateChanged, 
    signInWithCustomToken, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    TwitterAuthProvider, 
    updatePassword, 
    updateProfile, 
    User, 
    UserCredential,
} from "firebase/auth";
import { getAnalytics, logEvent, setUserId } from "firebase/analytics";
import "firebase/compat/performance";
import router from "@/router";
import api, { session } from "./api";
import { notify } from "./notify";
import { firebaseConfig } from "@/config";
import http from "./http";
import { cache } from "./cache";
import { appSession } from "./session";

const firebaseApp = initializeApp(firebaseConfig);
const analyticsApp = getAnalytics(firebaseApp);

export const analytics = {
    logEvent: (event: string, params?: {[key: string]: unknown}) => logEvent(analyticsApp, event, params),
    setUserId: (id: string) => setUserId(analyticsApp, id),
};
export const a = getAuth(firebaseApp);

function notInitialized() {
    throw Error("FIREBASE DID NOT INITIALIZE");
}

function invalidProvider() {    
    throw Error("INVALID PROVIDER");
}

async function loginUser(auth: Auth, user: User): Promise<boolean> {
    if (user.emailVerified) {
        analytics.logEvent("login");
        return true;
    } else {
        router.push({name: "verify-email"});
        return false;
    }
}

const providers: {
    [key: string]: AuthProvider;
} = {
    google: new GoogleAuthProvider(),
    twitter: new TwitterAuthProvider(),
    microsoft: (() => {
        const p = new OAuthProvider("microsoft.com");
        p.setCustomParameters({
            prompt: "consent",
        });
        return p;
    })(),
    facebook: new FacebookAuthProvider(),
    apple: (() => {
        const p = new OAuthProvider("apple.com");
        p.addScope("email");
        p.addScope("name");

        return p;
    })(),
};

class Auth {
    private accessToken = "";
    private expiresAt = 0;

    public errors = {
        createAccount: "",
    };
    
    public get emailVerified() {
        return a.currentUser?.emailVerified == true;
    }

    public get image() {
        return a.currentUser?.photoURL ?? "";
    }


    public get verificationEmailSent() {
        const storage = localStorage.getItem("verified_email_at");
        const verifiedAt = storage ? parseInt(storage) : undefined;

        const diff = new Date().getTime() - (verifiedAt ?? 0);
        if (verifiedAt && diff < 120000) {
            return true;
        }

        return false;
    }

    public set verificationEmailSent(value: boolean) {
        localStorage.setItem("verified_email_at", new Date().getTime().toString());
    }

    public async getProviders(email: string) {
        return await fetchSignInMethodsForEmail(a, email);
    }

    public async setDisplayName(name: string) {
        if (a.currentUser) {
            await updateProfile(a.currentUser, {
                displayName: name,
            });
        }
    }

    public async loginWithToken(token: string) {
        if (!a) {
            notInitialized();
        }

        await a.setPersistence(browserLocalPersistence);

        const result = await signInWithCustomToken(a, token);
        
        const user = result.user;

        if (user) {
            await loginUser(this, user);
        }
    }

    public async login(providerName: string) {
        if (!a) {
            notInitialized();
        }
        await a.setPersistence(browserLocalPersistence);

        const provider = providers[providerName];

        if (!provider) {
            invalidProvider();
        }

        const result = await signInWithPopup(a, provider);
        
        const user = result.user;

        if (user) {
            await loginUser(this, user);
        }
    }

    private switchCode(code: string) {
        switch (code) {
            case "auth/wrong-password":
                notify("error", "Wrong Password", "warning");
                break;
            case "auth/too-many-requests":
                notify("error", "Too many requests. Wait a few minutes", "warning");
                return;
            case "auth/email-already-in-use": 
                notify("error", "Email already in use", "warning");
                alert("Email already in use");
                return;
            case "auth/weak-password":
                notify("error", "Weak password", "error");
                return;
        }
    }

    public async forgotPassword(email: string) {
        if (!a) {
            notInitialized();
        }

        await session.resetPassword(email);
        notify("success", "Forgot Password", "success", "Check your email for the reset-link.");
    }

    public async loginWithEmailAndPassword(email: string, password: string, stayLoggedIn: boolean) {
        if (!a) {
            notInitialized();
        }
        if (stayLoggedIn) {
            await a.setPersistence(browserLocalPersistence);
        } else {
            await a.setPersistence(browserSessionPersistence);
        }

        const result = await signInWithEmailAndPassword(a, email, password)
            .catch(e => {
                this.switchCode(e.code);
                return;
            }) as UserCredential;

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

        const result = await createUserWithEmailAndPassword(a, email, password)
            .catch(e => {
                this.switchCode(e.code);
            });
        if (!result) return;

        const user = result.user;

        await updateProfile(user, {
            displayName,
        }).catch(e => {
            switch (e.code) {
                case "auth/too-many-requests":
                    notify("error", "Too many requests. Wait a few minutes", "warning");
                    return;
            }
        });

        if (user) {
            await this.sendLinkToEmail();
            return "VERIFICATION_EMAIL_SENT";
        }
        return "FAILED_SIGNIN";
    }

    public async resetPassword(oldPassword: string, password: string) {
        const user = a.currentUser;

        if (user) {
            try {
                await updatePassword(user, password);

                //console.log("updated password");
            }
            catch (e) {
                console.log(e);
                if (!user.email) throw new Error("No email found on account ???");

                await signInWithEmailAndPassword(a, user.email, oldPassword);

                await updatePassword(user, password);
            }
        }
    }

    public async sendLinkToEmail() {
        const user = a.currentUser;

        if (user && !this.verificationEmailSent) {
            this.verificationEmailSent = true;
            http.setToken(await user.getIdToken());
            await session.verifyEmail();
            router.push({name: "verify-email"});
        }
    }

    public async logout() {
        await a.signOut();
        localStorage.clear();
        cache.clearCache();
        window.location.replace("/");
    }

    public async verificationCode(code: string) {
        await applyActionCode(a, code);

        const user = a.currentUser;

        if (user?.emailVerified) {
            return "VERIFIED_EMAIL";
        }
        return "CODE_NOT_VALID";
    }

    public get isAuthenticated() {
        const user = a.currentUser;
        if (user?.emailVerified) {
            return true;
        }
        return false;
    }

    public async getToken() {
        const user = a.currentUser;
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

        if (url && a.currentUser) {
            await updateProfile(a.currentUser, {
                photoURL: url.image,
            });
        }
    }

    public get user() {
        return a.currentUser;
    }
}

const auth = new Auth();

onAuthStateChanged(a, async s => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("authToken");

    if (token) {
        await auth.loginWithToken(token);
    }

    appSession.ready();
});

export default auth;
