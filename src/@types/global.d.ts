interface User {
    id: string;
    displayName: string;
    email: string;
    language: string;
    subscriptions: Subscription[];
    roles: Role[];
}

interface Subscription {
    id: string;
    collection: Collection;
    creationDate: Date;
    validTo: Date;
}

interface Collection {
    id: string;
    name: {
        [lang: string]: string
    };
    key: string;
    image: string;
}

interface Role {
    id: string;
    name: string;
}