import { session } from "@/services/api";
import { ApiUser } from "dmb-api";
import UserSettings from "./userSettings";

export class User implements ApiUser {
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

    constructor(i: ApiUser) {
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
    }

    public async saveSettings() {
        await session.saveUser(this.settings ?? {});
    }

    public async saveProfile() {
        await session.saveProfile({});
    }
}
