import { StateProvider } from './state-provider.js'

export type StateFactory = <T>(initialValue: T) => StateProvider<T>
