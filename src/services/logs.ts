import { analytics } from "./auth";

type Events = "contributor" | "song" | "lyrics" | "lyricsChords"

type EventProps = {
    contributor: {
        contributor_id: string;
    };
    song: {
        song_id: string;
        collection_id: string;
    };
    lyrics: {
        collection_id: string;
        song_id: string;
        lyrics_language: string;
        lyrics_id: string;
    };
    lyricsChords: {
        collection_id: string;
        song_id: string;
        lyrics_id: string;
        lyrics_language: string;
        lyrics_transposition: number;
    };
}

class Logs {
    private logTypes: {
        [key: string]: string;
    } = {
        contributor: "contributor_view",
        song: "song_details_enter",
        lyrics: "lyrics_view",
        lyricsChords: "lyrics_view_transpose",
    };

    public event<E extends Events>(key: E, props: EventProps[E]) {
        analytics.logEvent(this.logTypes[key], props);
    }
}

export const logs = new Logs();
