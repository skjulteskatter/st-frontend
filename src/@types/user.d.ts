// USER TYPES
interface User {
    id: string;
    displayName: string;
    email: string;
    language: string;
    subscriptions: Subscription[];
    roles: Role[];
    settings?: UserSettings;
}

interface UserSettings {
    languageKey: string;
}

interface Subscription {
    id: string;
    collection: Collection;
    creationDate: Date;
    validTo: Date;
}

interface Role {
    id: string;
    name: string;
}