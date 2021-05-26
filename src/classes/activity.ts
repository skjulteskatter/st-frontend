import { useStore } from "@/store";
import { ApiActivity } from "dmb-api";
import { RouteLocationRaw } from "vue-router";
import { Collection } from "./collection";
import { Song } from "./song";


export class Activity {
    private activity: ApiActivity;
    private store = useStore();

    constructor(activity: ApiActivity) {
        this.activity = activity;
    }

    public getName(language: string) {
        return this.activity.item ? (this.activity.type == "song" ? new Song(this.activity.item).getName(language) : this.activity.item.name) : undefined;
    }

    public getRouterLink(collections: Collection[]): RouteLocationRaw {
        return this.activity.type == "song" ? {
            name: "song",
            params: {
                collection: collections.find(c => this.collectionIds.some(col => col == c.id))?.key ?? "",
                number: this.activity.item?.collections[0].number ?? "",
            },
        } : {
            name: "contributor",
            params: {
                contributor: this.activity.itemId,
            },
        };
    }

    public getImage(collections: Collection[]): string | undefined {
        return this.type == "song" ? collections.find(c => this.collectionIds.some(col => col == c.id))?.image : this.activity.item?.image ?? "/img/portrait-placeholder.png";
    }

    public timeSince(languageKey: string) {
        const rtfl = new Intl.RelativeTimeFormat(languageKey, {
            localeMatcher: "best fit",
            numeric: "auto",
            style: "long",
        });

        const now = new Date().getTime();
        const then = new Date(this.activity.loggedDate).getTime();

        const units: { unit: Intl.RelativeTimeFormatUnit; amount: number }[] = [
            { unit: "year", amount: 31536000000 },
            { unit: "month", amount: 2628000000 },
            { unit: "day", amount: 86400000 },
            { unit: "hour", amount: 3600000 },
            { unit: "minute", amount: 60000 },
            { unit: "second", amount: 1000 },
        ];

        const relatime = (elapsed: number) => {
            for (const { unit, amount } of units) {
                if (Math.abs(elapsed) > amount || unit === "second") {
                    return rtfl.format(Math.round(elapsed / amount), unit);
                }
            }
        };

        return relatime(then - now);
    }

    public get id() {
        return this.activity.id;
    }

    public get collectionIds(): string[] {
        return this.activity.type == "song" ? this.activity.item?.collections.map(c => c.id) ?? [] : [];
    }

    public get type() {
        return this.activity.type;
    }

    public get loggedDate() {
        return this.activity.loggedDate;
    }
}
