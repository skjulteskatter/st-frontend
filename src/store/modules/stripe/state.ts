import { Product } from "@/classes";

export type State = {
    products: Product[];
    publicKey: string;
    initialized: boolean;
    cart: string[];
    showCart: boolean;
};

export const state: State = {
    products: [],
    publicKey: "",
    initialized: false,
    cart: [],
    showCart: false,
};
