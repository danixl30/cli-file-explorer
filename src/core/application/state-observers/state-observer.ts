import { StateViewer } from '../state/state-provider.js'

export type StateObserver = <T>(
	callback: () => (() => void) | void,
	...states: StateViewer<T>[]
) => void
