import { analytics } from "./auth";

type Events = "song_view" | "song_list" | "collection_view" | "lyrics_view" | "lyrics_transpose" | "file_accessed" | "sheetmusic_view";

type EventModels = {
    song_view: {
        song_id: string;
        collection_id?: string | null;
    };
    song_list: {
        collection_id: string;
    };
    collection_view: {
        collection_id: string;
    };
    lyrics_view: {
        song_id?: string;
        collection_id?: string;
        lyrics_id: string;
        lyrics_language: string;
    };
    lyrics_transpose: {
        song_id?: string;
        collection_id?: string;
        lyrics_id: string;
        lyrics_language: string;
        lyrics_transposition: number;
    };
    file_accessed: {
        song_id?: string;
        collection_id?: string;
        file_id: string;
    };
    sheetmusic_view: {
        song_id?: string;
        collection_id?: string;
        file_id: string;
        sheetmusic_transposition: number;
    };
}

type AnalyticsEvent<E extends Events> = EventModels[E];

class AnalyticsService {
    public logEvent<E extends Events>(event: E, body: AnalyticsEvent<E>) {
        analytics.logEvent(event as string, body);
    }
}

export const analyticsService = new AnalyticsService();
