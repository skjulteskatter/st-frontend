import { ApiActivity } from "dmb-api";
import { RouteLocationRaw } from "vue-router";
import { Collection } from "./collection";
import { Song } from "./song";


export class Activity {
    private activity: ApiActivity;

    constructor(activity: ApiActivity) {
        this.activity = activity;
    }

    public getName(language: string) {
        return this.activity.item ? (this.activity.type == "song" ? new Song(this.activity.item).getName(language) : this.activity.item.name) : undefined;
    }

    public get id() {
        return this.activity.id;
    }

    public get collectionId() {
        return this.activity.type == "song" ? this.activity.item?.collectionId : undefined;
    }

    public get type() {
        return this.activity.type;
    }

    public get loggedDate() {
        return this.activity.loggedDate;
    }

    public getRouterLink(collections: Collection[]): RouteLocationRaw {
        return this.activity.type == "song" ? {
            name: "song",
            params: {
                collection: collections.find(c => c.id == this.collectionId)?.key ?? "",
                number: this.activity.item?.number ?? "",
            },
        } : {
            name: "contributor",
            params: {
                contributor: this.activity.itemId,
            },
        };
    }
}
