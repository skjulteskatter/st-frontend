import { ApiUser } from "dmb-api";

export class User implements ApiUser {
    public id;
    public address;
    public birthDay;
    public displayName;
    public email;
    public gender;
    public image;
    public lastLogin;
    public privacyPolicy;
    public roles;
    public settings;
    public subscriptions;
    public termsAndConditions;

    constructor(i: ApiUser) {
        this.id = i.id;
        this.address = i.address;
        this.birthDay = i.birthDay;
        this.displayName = i.displayName;
        this.email = i.email;
        this.gender = i.gender;
        this.image = i.image;
        this.lastLogin = i.lastLogin;
        this.privacyPolicy = i.privacyPolicy;
        this.roles = i.roles;
        this.settings = i.settings;
        this.subscriptions = i.subscriptions;
        this.termsAndConditions = i.termsAndConditions;
    }
}
