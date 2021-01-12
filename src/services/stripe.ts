import { stripe as api } from '@/services/api';
import  { loadStripe, Stripe } from '@stripe/stripe-js';

class StripeService {
    private service: Stripe = {} as Stripe;

    public async init(publicKey: string) {
        const stripe = await loadStripe(publicKey)
        if (stripe === null) {
            throw new Error("Stripe failed to load");
        }

        this.service = stripe;
    }

    public setup() {
        return api.setup();
    }

    public async checkout(priceId: string) {
        const session = await api.startSession(priceId);

        this.service.redirectToCheckout(session).catch(err => {
            if (err) throw err;
        });
    }
}

const stripeService = new StripeService();

export default stripeService;