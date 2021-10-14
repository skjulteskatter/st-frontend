import { User } from "@/classes";


export type State = {
    users: User[];
    roles: string[];
}

export const state: State = {
    users: [],
    roles: [],
};
