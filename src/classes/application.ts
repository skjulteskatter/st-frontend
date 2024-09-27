const baseTitle = "SongTreasures";

class Application {
    public setTitle(title: string | null | undefined) {
        if (!title) {
            window.document.title = baseTitle;
            return;
        }

        window.document.title = `${title} - ${baseTitle}`;
    }
}

export const application = new Application();
