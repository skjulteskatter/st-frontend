import { Product } from "@/classes";
import { SetupResponse } from "songtreasures-api/checkout";
import { stripe } from "../api";
import StripeService from "../stripe";

type Hooks = "productsUpdated" | "checkout"
type Hook = () => Promise<void> | void;

class StoreService {
    private _setup?: SetupResponse;

    private _cart: string[] = [];
    public type: "year" | "month" = "year";

    private _stripeService?: StripeService;

    public toggleType() {
        this.type = this.type === "year" ? "month" : "year";
    }

    public get cart() {
        return this._cart;
    }

    public set cart(v) {
        this._cart = v;
        this.runHooks("productsUpdated");
    }

    private async getStripeService() {
        if (!this._stripeService) {
            this._stripeService = new StripeService((await this.getSetup()).key);
        }
        return this._stripeService;
    }

    private async getSetup() {
        if (!this._setup) {
            this._setup = await stripe.setup();
        }
        return this._setup;
    }

    public async getProducts() {
        return (await this.getSetup()).products.map(i => new Product(i));
    }

    public async checkout() {
        this.runHooks("checkout");
        (await this.getStripeService()).checkout(this.cart, this.type);
    }

    public async portal() {
        return (await stripe.getPortalSession() as {url: string}).url;
    }

    public refreshSubscriptions() {
        return stripe.refreshSubscriptions();
    }

    public addProduct(productId: string) {
        if (!this.cart.includes(productId)) {
            this.cart.push(productId);
        }
        this.runHooks("productsUpdated");
    }

    public removeProduct(productId: string) {
        this.cart = this.cart.filter(c => c !== productId);
        this.runHooks("productsUpdated");
    }

    public async getCartItems() {
        return (await this.getProducts()).filter(p => this.cart.includes(p.id));
    }

    public async contains(productId: string) {
        return (await this.getCartItems()).some(i => i.id === productId);
    }

    private async runHooks(key: Hooks) {
        if (this.hooks[key]) {
            for (const hook of this.hooks[key]) {
                await hook();
            }
        }
    }

    public registerHook(key: Hooks, hook: Hook) {
        this.hooks[key].push(hook);
    }

    private hooks = {
        productsUpdated: [] as Hook[],
        checkout: [] as Hook[],
    };
}


export default new StoreService();
