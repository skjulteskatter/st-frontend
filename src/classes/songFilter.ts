import { IMediaFile } from "songtreasures";
import { Song } from ".";

export type TSongFilter = {
    themes: string[];
    origins: string[];
    videoFiles: string[];
    audioFiles: string[];
    categoryIds: string[];
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
    public categoryIds;
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
        this.categoryIds = i.categoryIds;
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
        const hasFiles = (filter: string[], files: IMediaFile[]) => {
            return filter.length === 0 || filter.every(f => files.some(i => i.category === f));
        };
        const hasIds = (filter: string[], prop: string[] | string) => {
            return filter.length === 0 || filter.every(f => prop.includes(f));
        };
        
        return this._songs.filter(s => (
            !this.hasAudioFiles || s.audioFiles.length > 0)
            && (!this.hasVideoFiles || s.videoFiles.length > 0)
            && (!this.hasSheetMusic || s.sheetMusic.length > 0)
            && (!this.hasLyrics || s.hasLyrics)
            && hasFiles(this.audioFiles, s.audioFiles)
            && hasFiles(this.videoFiles, s.videoFiles)
            && hasFiles(this.sheetMusicTypes, s.sheetMusic)
            && hasIds(this.contentTypes, [s.type])
            && hasIds(this.themes, s.themeIds)
            && hasIds(this.origins, s.origins.map(o => o.country))
            && hasIds(this.categoryIds, s.categoryIds),
        );
    }
}
