import { Song } from '.';

export class Lyrics implements LyricsInterface {
    collection = {} as Collection;
    content = {};
    format = "";
    hasChords = false;
    language = {} as Language;
    originalKey = "";
    transposedToKey = "";
    song = {} as Song;
}