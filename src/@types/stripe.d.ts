
declare module "checkout" {
    interface SessionRequest {
        productIds: string[];
        successUrl: string;
        cancelUrl: string;
    }

    interface SessionResponse {
        sessionId: string;
    }

    interface PortalRequest {
        sessionId: string;
    }
    
    interface SetupResponseCollection {
        id: string;
        name: string;
    }

    interface SetupResponse {
        key: string;
        products: ApiProduct[];
    }
    
    interface ApiProduct {
        id: string;
        name: LocaleString;
        collectionIds: string[];
        collections?: ApiCollection[];
        prices: Price[];
        priority: number;
    }
}
