import config from '../config'
import auth from './auth'
import isomorphicfetch from 'isomorphic-fetch'

class Http {
    public validateResponse (response: any) {
        return new Promise((resolve, reject) => {
            if (response.status >= 200 && response.status < 300) {
                resolve(response)
            } else if (response.status === 401) {
                setTimeout(() => {
                    if (!auth.isAuthenticated) {
                        auth.login()
                    }
                }, 10000)
                // auth.startLogin();
                // resolve(null);
                reject(new Error('Unauthorized'))
            } else {
                const error = new Error(response.statusText)
                // error.response = response;
                reject(error)
            }
        })
    }

    public parseJson (response: any) {
        return response.json()
    }

    /**
     * API GET request
     *
     * @param  {String} path
     * @return {Promise}
     */
    public get<T> (path: string): Promise<T> {
        return this.apifetch(
            path,
            {
                method: 'GET'
            }
        )
    }

    /**
     * API POST request
     *
     * @param  {String} path
     * @param  {Object} content
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public post<T> (
        path: string,
        content: any,
        options?: object
    ): Promise<T> {
        return this.apifetch(
            path,
            Object.assign(
                {
                    method: 'POST',
                    body: JSON.stringify(content)
                },
                options || {}
            )
        )
    }

    /**
     * API DELETE request
     *
     * @param  {String} path
     * @param  {Object} query (optional)
     * @param  {Object} options (optional)
     * @return {Promise}
     */
    public ['delete']<T> (
        path: string,
        options?: object
    ): Promise<T> {
        return this.apifetch(
            path,
            Object.assign(
                {
                    method: 'DELETE'
                },
                options || {}
            )
        )
    }

    /**
     * API PUT request
     *
     * @param  {String} path
     * @param  {Object} content
     * @return {Promise}
     */
    public put<T> (
        path: string,
        content: any
    ): Promise<T> {
        return this.apifetch(
            path,
            Object.assign(
                {
                    method: 'PUT',
                    body: JSON.stringify(content)
                }
            )
        )
    }

    public apifetch (path: string, options: RequestInit) {
        path = `${config.api.basePath}${path}`
        return isomorphicfetch(path, {
            method: options.method,
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(this.validateResponse)
            .then(this.parseJson)
    }
}

const http = new Http()
export default http
