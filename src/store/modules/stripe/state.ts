import { Product } from "@/classes";

export type State = {
    products: Product[];
    publicKey: string;
    initialized: boolean;
    cart: string[];
    type: "year" | "month";
    showCart: boolean;
};

export const state: State = {
    products: [],
    publicKey: "",
    initialized: false,
    type: "month",
    cart: [],
    showCart: false,
};
