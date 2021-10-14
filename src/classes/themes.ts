import { cache } from "@/services/cache";
import { appSession } from "@/services/session";

type Theme = {
    background: string;
    secondaryBackground: string;
    text: string;
    borderColor: string;
    borderRadius?: string;
    fontFamily?: string;
}

export class Themes {
    public themes: {
        [key: string]: Theme;
    } = {
        dark: {
            background: "#181818",
            secondaryBackground: "#0F0F0F",
            text: "#F5F7FA",
            borderColor: "#252525",
        },
        light: {
            background: "var(--st-color-grey)",
            secondaryBackground: "var(--st-color-white)",
            text: "var(--st-color-grey-dark)",
            borderColor: "var(--st-color-tertiary)",
        },
    }

    private applyTheme(key?: "light" | "dark") {
        if (key === "dark") document.documentElement.classList.add("dark");
        else if (key === "light") document.documentElement.classList.remove("dark");
    }

    public setTheme(key: "light" | "dark" = "light") {
        const theme = this.themes[key];

        if (!theme) {
            throw new Error("Theme not valid");
        }

        this.applyTheme(key);

        cache.set("config", "theme", key);
        if (appSession.user.settings) {
            appSession.user.settings.theme = key;
        }
    }

    public setThemeProperties(params: Theme) {
        this.setCSSProperty("--st-color-background", params.background);
        this.setCSSProperty("--st-color-background-card", params.secondaryBackground);
        this.setCSSProperty("--st-color-text", params.text);
        this.setCSSProperty("--st-color-border", params.borderColor);
        if (params.borderRadius) this.setCSSProperty("--st-border-radius", params.borderRadius);
        if (params.fontFamily) this.setCSSProperty("--st-font-family", params.fontFamily);
    }

    public setCSSProperty(prop: string, value: string) {
        document.documentElement.style.setProperty(prop, value);
    }

    public setThemeColor(color: string) {
        localStorage.setItem("theme_color", color);
        this.setCSSProperty("--st-color-primary", color);
    }

    public load() {
        this.applyTheme(cache.get("config", "theme") as unknown as undefined | "dark" | "light");
    }

    public get keys() {
        return Object.keys(this.themes);
    }

    public get default() {
        return "#BD9B60";
    }
}

const themes = new Themes();

export default themes;
