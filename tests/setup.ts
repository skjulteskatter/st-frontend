import "jsdom-global/register";

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: (): void => undefined,
        removeEventListener: (): void => undefined,
    }),
});
