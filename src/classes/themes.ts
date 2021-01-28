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
                background: '#2C2F33',
                secondaryBackground: '#232527',
                text: '#F5F7FA',
                borderColor: '#393d42'
            },
            light: {
                background: '#FFFFFF',
                secondaryBackground: '#EAEAEA',
                text: '#333333',
                borderColor: '#D0D0D0'
            }
        }

    public setTheme(key: string) {
        const theme = this.themes[key];

        if (!theme) {
            throw new Error("Theme not valid");
        }

        this.setThemeProperties(theme);
        localStorage.setItem('theme', key)
    }

    public setThemeProperties(params: Theme) {
        this.setCSSProperty('--st-background-color', params.background)
        this.setCSSProperty('--st-secondary-background-color', params.secondaryBackground)
        this.setCSSProperty('--st-text-color', params.text)
        this.setCSSProperty('--st-border-color', params.borderColor)
        if (params.borderRadius) this.setCSSProperty('--st-border-radius', params.borderRadius)
        if (params.fontFamily) this.setCSSProperty('--font-family', params.fontFamily)
    }

    public setCSSProperty(prop: string, value: string) {
        document.documentElement.style.setProperty(prop, value);
    }

    public setThemeColor(color: string) {
        localStorage.setItem('theme_color', color)
        this.setCSSProperty('--st-primary-color', color)
    }

    public load() {
        this.setTheme(localStorage.getItem('theme') ?? 'light');
    }

    public get keys() {
        return Object.keys(this.themes);
    }

    public get default() {
        return '#5372e2';
    }
}

const themes = new Themes();

export default themes;