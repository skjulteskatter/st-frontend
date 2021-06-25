// USER TYPES
interface User {
    id: string;
    displayName: string;
    image: string;
    email: string;
    subscriptions: Subscription[];
    roles: string[];
    address: {};
    birthDay: string;
    gender: "male" | "female" | "unknown";
    settings?: UserSettings;
    lastLogin: Date;
    privacyPolicy: boolean;
    termsAndConditions: boolean;
}

interface UserSettings {
    languageKey?: string;
    defaultTransposition?: string;
    defaultTranscode?: string;
}

interface Subscription {
    id: string;
    productIds: string[];
    collectionIds: string[];
    validTo: Date;
    valid: boolean;
}

interface Role {
    id: string;
    name: string;
}
