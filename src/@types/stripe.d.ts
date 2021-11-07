
declare module "checkout" {
    interface SessionRequest {
        productIds: string[];
        successUrl: string;
        cancelUrl: string;
        country?: string;
        type: "year" | "month";
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
        name: ILocaleString;
        collectionIds: string[];
        prices: Price[];
        priority: number;
    }
}
