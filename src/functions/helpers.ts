import { CollectionItem } from "@/classes";
import { songs } from "@/services/api";
import { cache } from "@/services/cache";
import { notify } from "@/services/notify";
import { ApiCollectionItem, ApiContributor } from "dmb-api";

let contributors: CollectionItem<ApiContributor>[];

export const getContributors = async (offline: boolean) => {
    if (contributors) {
        return contributors;
    }

    let result: CollectionItem<ApiContributor>[] = [];

    if (offline) {
        try {
            const key = "contributors_last_updated";
            const lastUpdated = await cache.get("config", key) as string | undefined;
            const updateContributors = await songs.getAllContributors(lastUpdated);

            await cache.replaceEntries("contributors", updateContributors.reduce((a, b) => {
                a[b.id] = b;
                return a;
            }, {} as {
                [id: string]: ApiCollectionItem<ApiContributor>;
            }));

            const now = new Date();

            await cache.set("config", key, new Date(now.getTime() - 172800).toISOString());
        }
        catch (e) {
            notify("error", "Error occured", "warning", e);
            result = (await songs.getAllContributors()).map(c => new CollectionItem(c));
        }
        result = result.length > 0 ? result : (await cache.getAll("contributors")).map(c => new CollectionItem(c));
    } else {
        result = (await songs.getAllContributors()).map(c => new CollectionItem(c));
    }

    contributors = result.sort((a, b) => a.item.name > b.item.name ? 1 : -1);

    return contributors;
};
