import { Product } from "@/classes";

export type State = {
    products: Product[];
    publicKey: string;
    initialized: boolean;
};

export const state: State = {
    products: [],
    publicKey: "",
    initialized: false,
};
