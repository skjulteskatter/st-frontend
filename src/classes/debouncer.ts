/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyFunction = (this: any, ...args: any[]) => any;

class Debouncer {
    /**
     * A method that will delay execution every time it is invoked, until it is {delay} milliseconds since last invocation.
     * Very nice to use on 'resize' and 'mouse move' events where methods are called 1000x times in a second.
     */
    public debounce<T extends AnyFunction> (callback: T, delay: number): T {
        let timeout: number | null = null;
        let resolvers: ((returnValue: any) => void)[] = [];

        function resolveResolvers (returnValue: any) {
            for(const resolve of resolvers) {
                resolve(returnValue);
            }

            resolvers = [];
        }

        return function(this: any, ...args: any[]) {
            if(timeout) {
                clearTimeout(timeout);
            }

            const p = new Promise(resolve => {
                resolvers.push(resolve);
            });

            timeout = setTimeout(() => {
               timeout = null;
               const res = callback.apply(this, args);

               if(res instanceof Promise) {
                   res.then(resolveResolvers);
               } else {
                   resolveResolvers(res);
               }
            }, delay);

            return p;
        } as any as T;
    }
}

export const debouncer = new Debouncer();
