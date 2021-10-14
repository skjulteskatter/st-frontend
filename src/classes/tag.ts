import { tags } from "@/services/api";
import { cache } from "@/services/cache";
import { ApiTag } from "dmb-api";

export default class Tag implements ApiTag {
    public id;
    public userId;
    public canEdit;
    public name;
    public songIds;
    public type;
    public color;

    private saved: ApiTag;

    constructor(i: ApiTag) {
        this.saved = i;

        this.id = i.id;
        this.userId = i.userId;
        this.canEdit = i.canEdit;
        this.name = i.name;
        this.songIds = i.songIds;
        this.type = i.type;
        this.color = i.color;
    }

    public async save() {
        await cache.set("tags", this.id, {
            id: this.id,
            canEdit: this.canEdit,
            color: this.color,
            name: this.name,
            songIds: Object.assign([], this.songIds),
            type: this.type,
            userId: this.userId,
        });
    }

    public async update(name?: string, color?: string) {
        this.name = name ?? this.name;
        this.color = color ?? this.color;

        await tags.update(this.id, this.name, this.color);

        await this.save();
    }

    public async addSongsToTag(songIds: string[]) {
        for (const i of songIds) {
            if (!this.songIds.includes(i)) {
                this.songIds.push(i);
            }
        }

        await tags.update(this.id, undefined, undefined, songIds);

        await this.save();
    }

    public async removeSongsFromTag(songIds: string[]) {
        this.songIds = this.songIds.filter(i => !songIds.includes(i));

        await tags.update(this.id, undefined, undefined, undefined, songIds);

        await this.save();
    }
}
