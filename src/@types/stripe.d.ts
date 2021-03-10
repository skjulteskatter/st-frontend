
declare module "checkout" {
    interface SessionRequest {
        productId: string;
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
        products: ProductInterface[];
    }
}