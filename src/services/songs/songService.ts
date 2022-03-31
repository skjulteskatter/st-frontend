import { ListEntry } from "@/classes";
import { ICollection, ISong, Song, SongService } from "hiddentreasures-js";
import { Sort } from "songtreasures-api";
import client from "../client";

export default new SongService(client);

const lists: {
    [key: string]: ListEntry[],
} = {};

const getNumber = (song: ISong, collectionId: string) => song.collections.find(i => i.collectionId === collectionId)?.number ?? 0;

export const getList = (value: Sort, songs: Song[], collection: ICollection) => {
    const songsPerCard = 50;

    // let result: Song[] = songs;
    if (!lists[value]) {
        switch (value) {
            case "number":
                lists[value] = songs.reduce((a, b) => {
                    const number = Math.floor((getNumber(b, collection.id)) / songsPerCard);
                    let entry = a[number];
                    if (!entry) {
                        entry = {
                            title: `${(number * songsPerCard) + 1}-${number * songsPerCard + songsPerCard}`,
                            songs: [],
                            count: false,
                        };
                        a[number] = entry;
                    }
                    entry.songs.push(b);

                    return a;
                }, [] as ListEntry[]).map(i => {
                    i.songs = i.songs.sort((a, b) => getNumber(a, collection.id) - getNumber(b, collection.id));
                    return i;
                });
                break;
            case "title":
                // result = result.sort((a, b) => a.title > b.title ? 1 : -1);
                lists[value] = songs.reduce((a, b) => {
                    const letter = b.title
                        .replace(/[\W]/g, "")[0]
                        .toUpperCase();
                    if (letter) {
                        let entry = a.find(i => i.title === letter);
                        if (!entry) {
                            entry = {
                                title: letter,
                                songs: [],
                                count: true,
                            };
                            a.push(entry);
                        }
                        entry.songs.push(b);
                    }
                    return a;
                }, [] as ListEntry[]);
                break;
            // case "countries":
            //     songs = this.songs.filter(s => s.origins.some(o => o.type === "text")).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
            //     this._lists[value] = appSession.countries.map(i => 
            //         {
            //             return {
            //                 title: i.getName(),
            //                 count: true,
            //                 songs: songs.filter(s => s.origins.some(o => o.type === "text" && o.country === i.countryCode)),
            //             };
            //         },
            //     );
            //     break;
            // case "themes":
            //     songs = this.songs.filter(i => i.themeIds.length).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
            //     this._lists[value] = appSession.themes.map(i => 
            //         {
            //             return {
            //                 title: i.getName(),
            //                 count: true,
            //                 songs: songs.filter(i => i.themeIds.includes(i.id)),
            //             };
            //         },
            //     );
            //     break;
            // case "genre":
            //     songs = this.songs.filter(i => i.genreIds.length).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
            //     this._lists[value] = appSession.genres.map(i =>
            //         {
            //             return {
            //                 title: i.getName(),
            //                 count: true,
            //                 songs: songs.filter(s => s.genreIds.includes(i.id)),
            //             };
            //         },
            //     );
            //     break;
            // case "categories":
            //     songs = this.songs.filter(i => i.categoryIds.length).sort((a, b) => a.getName() < b.getName() ? 1 : -1);
            //     this._lists[value] = appSession.categories.map(i => 
            //         {
            //             return {
            //                 title: i.getName(),
            //                 count: true,
            //                 songs: songs.filter(s => s.categoryIds.includes(i.id)),
            //             };
            //         },
            //     );
            //     break;
            // case "author":
            // case "composer":
            //     this._lists[value] = this.contributors.map(i => {
            //         return {
            //             title: i.name,
            //             count: true,
            //             songs: this.songs.filter(s => s.participants.some(p => p.type === value && p.contributorId === i.id)),
            //             action: () => router.push({
            //                 name: "contributor",
            //                 params: {
            //                     contributor: i.id,
            //                 },
            //             }),
            //         };
            //     });
            //     break;
            // default:
            //     return this.getList(this.defaultSort);
        }
    }
    return lists[value];
}