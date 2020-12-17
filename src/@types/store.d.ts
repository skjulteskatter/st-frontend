import { Store } from '../store'

declare module '*' {
    interface Vue {
        $store: Store
    }
}