
declare module "checkout" {
    interface SessionRequest {
        priceId: string;
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