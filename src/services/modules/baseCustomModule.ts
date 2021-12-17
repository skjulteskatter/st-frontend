// import { ICustomCollection, ITag } from "songtreasures-api";
// import { cache } from "../cache";
// import { Deleteable, Refreshable } from "../interfaces";
// import BaseModule from "./baseModule";

// type SupportedModules = ICustomCollection | ITag

// export default abstract class BaseCustomModule<T extends TInterface & Deleteable & Refreshable, TInterface extends SupportedModules, TCreateOptions> extends BaseModule<T, TInterface> {
//     public items: T[] = [];

//     public async delete(id: string) {
//         await (await this.get(id)).delete();
//         await cache.delete(this.store, id);
//         this.items = this.items.filter(i => i.id !== id);
//     }

//     public abstract create: (options: TCreateOptions) => Promise<T>;
// }
