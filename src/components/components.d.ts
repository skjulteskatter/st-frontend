declare module "vue" {
    export interface GlobalComponents {
        Loader: typeof import("@/components")["Loader"];
        BaseButton: typeof import("@/components")["BaseButton"];
        BaseCard: typeof import("@/components")["BaseCard"];
    }
}

export {};
