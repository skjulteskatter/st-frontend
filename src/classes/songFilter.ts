import { Song } from ".";

export type TSongFilter = {
    themes: string[];
    origins: string[];
    videoFiles: string[];
    audioFiles: string[];
    contentTypes: string[];
    sheetMusicTypes: string[];
    hasLyrics: boolean;
    hasAudioFiles: boolean;
    hasVideoFiles: boolean;
    hasSheetMusic: boolean;
}

export default class SongFilter implements TSongFilter {
    public themes;
    public origins;
    public videoFiles;
    public audioFiles;
    public contentTypes;
    public sheetMusicTypes;
    public hasLyrics;
    public hasAudioFiles;
    public hasVideoFiles;
    public hasSheetMusic;

    constructor (i: TSongFilter, songs?: Song[]) {
        if (songs) {
            this._songs = songs;
        }
        this.themes = i.themes;
        this.origins = i.origins;
        this.videoFiles = i.videoFiles;
        this.audioFiles = i.audioFiles;
        this.contentTypes = i.contentTypes;
        this.sheetMusicTypes = i.sheetMusicTypes;
        this.hasLyrics = i.hasLyrics;
        this.hasAudioFiles = i.hasAudioFiles;
        this.hasVideoFiles = i.hasVideoFiles;
        this.hasSheetMusic = i.hasSheetMusic;
    }

    private _songs: Song[] = [];

    public SetSongs(songs: Song[]) {
        this._songs = songs;
    }

    public GetSongs() {
        return this._songs.filter(s => (
            !this.hasAudioFiles || s.audioFiles.length > 0)
            && (!this.hasVideoFiles || s.videoFiles.length > 0)
            && (!this.hasSheetMusic || s.sheetMusic.length > 0)
            && (!this.hasLyrics || s.hasLyrics)
            && (this.audioFiles.length === 0 || s.audioFiles.some(a => this.audioFiles.includes(a.category)))
            && (this.videoFiles.length === 0 || s.videoFiles.some(a => this.videoFiles.includes(a.category)))
            && (this.sheetMusicTypes.length === 0 || s.sheetMusic.some(a => this.sheetMusicTypes.includes(a.category)))
            && (this.contentTypes.length === 0 || this.contentTypes.includes(s.type))
            && (this.themes.length === 0 || s.themeIds.some(i => this.themes.includes(i)))
            && (this.origins.length === 0 || s.origins.some(i => this.origins.includes(i.country))
        ));
    }
}
