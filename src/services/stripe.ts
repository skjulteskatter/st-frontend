import { stripe as api } from "@/services/api";
import  { loadStripe, Stripe } from "@stripe/stripe-js";

class StripeService {
    private service: Stripe | null = null;
    private key = "";

    public async init(publicKey: string) {
        this.key = publicKey;
        // const stripe = await loadStripe(publicKey);
        // if (stripe === null) {
        //     throw new Error("Stripe failed to load");
        // }

        // this.service = stripe;
    }

    public setup() {
        return api.setup();
    }

    public async checkout(productIds: string[], type: "year" | "month") {
        this.service = await loadStripe(this.key);

        const session = await api.startSession(productIds, type);

        await this.service?.redirectToCheckout(session).catch(err => {
            if (err) throw err;
        });
    }

    public async portal() {
        return (await api.getPortalSession() as {url: string}).url;
    }

    public refreshSubscriptions() {
        return api.refreshSubscriptions();
    }
}

const stripeService = new StripeService();

export default stripeService;
