import { ComponentCustomProperties } from "vue";
import { Store } from "@/store";// path to store file

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: Store;
    }
}
