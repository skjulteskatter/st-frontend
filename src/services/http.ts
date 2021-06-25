import config from "../config";
import auth from "./auth";
import { notify } from "./notify";

class Http {
    public async getCountry(): Promise<string> {
        let entry = localStorage.getItem("country");

        if (!entry && entry?.length != 2) {
            entry = await this.get<string>("api/Session/Country");
            localStorage.setItem("country", entry);
        }

        return entry;
    }

    public validateResponse(response: Response): Promise<Response> {
        return new Promise((resolve, reject) => {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else if (response.status === 401) {
                // auth.startLogin();
                // resolve(null);
                reject({status: response.status, value: "Unauthorized"});
            } else {
                // error.response = response;
                response.text().then(t =>  {
                    reject({status: response.status, value: t});
                });
            }
        });
    }

    public async parseJson(response: Response) {
        const result = await response.text();
        try {
            return JSON.parse(result);
        }
        catch {
            return result;
        }
    }

    /**
     * API GET request
     *
     * @param  {String} path
     * @return {Promise}
     */
    public async get<T>(path: string, bypassAuth?: boolean): Promise<T> {
        const result = await this.apifetch(
            path,
            {
                method: "GET",
            }, 
            bypassAuth,
        ) as Result<T>;

        return result.result;
    }

    public async getWithResult<T>(path: string): Promise<Result<T>> {
        const result = await this.apifetch(
            path,
            {
                method: "GET",
            },
            false,
        ) as Result<T>;

        return result;
    }

    /**
     * API POST request
     *
     * @param  {String} path
     * @param  {Object} content
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public async post<T, Y = T>(
        path: string,
        content?: Y,
        options?: object,
    ): Promise<T> {
        const result = await this.apifetch(
            path,
            Object.assign(
                {
                    method: "POST",
                    body: content ? JSON.stringify(content) : undefined,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                options || {},
            ),
        ) as Result<T>;
        return result.result;
    }

    /**
     * API PATCH request
     *
     * @param  {String} path
     * @param  {Object} content
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public async patch<T>(
        path: string,
        content: unknown,
    ): Promise<T> {
        const result = await this.apifetch(
            path,
            {
                method: "PATCH",
                body: JSON.stringify(content),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        ) as Result<T>;
        return result.result;
    }

    /**
     * API DELETE request
     *
     * @param  {String} path
     * @param  {Object} query (optional)
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public async ["delete"]<T>(
        path: string,
        options?: object,
    ): Promise<T> {
        const result = await this.apifetch(
            path,
            Object.assign(
                {
                    method: "DELETE",
                },
                options || {},
            ),
        ) as Result<T>;

        return result.result;
    }

    /**
     * API PUT request
     *
     * @param  {String} path
     * @param  {Object} content
     * @return {Promise}
     */
    public async put<T, Y = T>(
        path: string,
        content: Y,
    ): Promise<T> {
        const result = await this.apifetch(
            path,
            Object.assign(
                {
                    method: "PUT",
                    body: JSON.stringify(content),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            ),
        ) as Result<T>;
        return result.result;
    }

    private _token: string | null = null;

    public setToken(value: string) {
        this._token = value;
    }

    public async uploadAndDownload(path: string, content: string) {
        path = `${config.api.basePath}${path}`;
        const token = this._token ?? await auth.getToken();
        if (!token) throw new Error("No Authorization token available " + path);

        const headers = {
            "Authorization": `Bearer ${token}`,
            "X-Api-Version": "3.0",
            "Content-Type": "application/json",
        };

        try {
            const result = await fetch(path, {
                headers,
                method: "POST",
                body: JSON.stringify({
                    content,
                }),
            });
            return result;
        }
        catch (e) {
            notify("error", e.status, "warning", e.value);
        }
    }

    public async apifetch(path: string, options: RequestInit, bypassAuth = false) {
        path = `${config.api.basePath}${path}`;
        const token = this._token ?? await auth.getToken();
        if (!token && !bypassAuth) throw new Error("No Authorization token available " + path);

        const headers = Object.assign({
            "Authorization": `Bearer ${token}`,
            "X-Api-Version": "3.0",
        }, options.headers);

        const o = Object.assign(
            options, {headers});
        try {
            const result = await fetch(path, o)
                .then(this.validateResponse)
                .then(this.parseJson);
            return result;
        }
        catch (e) {
            notify("error", e.status, "warning", e.value);
        }
    }
}

const http = new Http();
export default http;
