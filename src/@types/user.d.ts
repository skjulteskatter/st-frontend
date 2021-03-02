// USER TYPES
interface User {
    id: string;
    displayName: string;
    image: string;
    email: string;
    subscriptions: Subscription[];
    roles: string[];
    settings?: UserSettings;
}

interface UserSettings {
    languageKey?: string;
    defaultTransposition?: string;
}

interface Subscription {
    id: string;
    productId: string;
    collectionIds: string[];
    validTo: Date;
    valid: boolean;
}

interface Role {
    id: string;
    name: string;
}