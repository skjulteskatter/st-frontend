
declare module "checkout" {
    interface SessionRequest {
        priceId: string;
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
        collections: SetupResponseCollection[];
    }
}