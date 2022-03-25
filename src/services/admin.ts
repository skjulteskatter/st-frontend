import { User } from "@/classes";
import api from "./api";

export class AdminService {
    private initialized = false;

    private users: User[] = [];
    public get Users() {
        return this.users;
    }

    private roles: string[] = [];
    public get Roles() {
        return this.roles;
    }

    public async initialize() {
        if (this.initialized == false)
            return;

        this.roles = await api.admin.getRoles();
    }

    public async getUsers(query: string) {
        this.users = (await api.admin.getUsers(query)).map(i => new User(i));
    }

    public async getUsersWithRoles() {
        this.users = (await api.admin.getUsersWithRoles()).map(i => new User(i));
    }

    public async getUser(id: string) {
        return await api.admin.getUser(id);
    }

	public NewSubs: {
        [key: string]: {
            [key: string]: boolean;
        };
    } = {};

    public ValidTo: {
        [key: string]: string;
    } = {};
}

export const adminService = new AdminService();
