import Category from "./category";
import CollectionItem from "./collectionItem";
import Contributor from "./contributor";
import Favorites from "./favorites";
import Lyrics from "./lyrics";
import MediaFile from "./mediaFile";
import Instrument from "./instrument";
import Participant from "./participant";
import Product from "./product";
import Tag from "./tag";
import User from "./user";
import UserSettings from "./userSettings";
import { Song, Collection } from "hiddentreasures-js";

export * from "./transposer";
export * from "./base64";
export * from "./items";

export enum SheetMusicTypes {
    PDF = "sheetmusic-pdf",
    XML = "sheetmusic"
}

export type ListEntry = {
    title: string;
    songs: Song[];
    action?: () => void;
    count: boolean;
};

export {
    Category,
    CollectionItem,
    Contributor,
    Favorites,
    Lyrics,
    MediaFile,
    Instrument,
    Participant,
    Product,
    Tag,
    Song,
    User,
    UserSettings,
    Collection,
};
