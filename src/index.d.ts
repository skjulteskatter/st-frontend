import "vue";

declare module "vue" {
    function reactive<T>(object: T): T;
}
