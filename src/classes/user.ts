import { session } from "@/services/api";
import { cache } from "@/services/cache";
import { IUser } from "songtreasures-api";
import UserSettings from "./userSettings";

export default class User implements IUser {
    public id;
    public birthDay;
    public displayName;
    public email;
    public gender;
    public image;
    public lastLogin;
    public privacyPolicy;
    public roles;
    public settings: UserSettings;
    public subscriptions;
    public termsAndConditions;
    public registered;

    constructor(i: IUser) {
        this.id = i.id;
        this.birthDay = i.birthDay;
        this.displayName = i.displayName;
        this.email = i.email;
        this.gender = i.gender;
        this.image = i.image;
        this.lastLogin = i.lastLogin;
        this.privacyPolicy = i.privacyPolicy;
        this.roles = i.roles;
        this.settings = new UserSettings(i.settings ?? {});
        this.subscriptions = i.subscriptions;
        this.termsAndConditions = i.termsAndConditions;
        this.registered = i.registered;
    }

    public async saveSettings() {
        await session.saveUser(this.settings ?? {});
        await cache.delete("general", "user");
    }

    public async saveProfile() {
        await session.saveProfile({});
        await cache.delete("general", "user");
    }

    public async completeRegistration() {
        await session.saveProfile({}, true);
        this.registered = true;
        await cache.delete("general", "user");
    }

    public async acceptPrivacyPolicy() {
        await session.acceptPrivacyPolicy();
        this.privacyPolicy = true;
    }

    public get Admin() {
        return this.roles.includes("administrator");
    }

    public get Extended() {
        return this.roles.includes("extended") || this.Admin;
    }

    public get Techinican() {
        return this.roles.includes("technician") || this.Admin;
    }
}
