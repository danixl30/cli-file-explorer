import { Optional } from '../../utils/optional.js'
import { StateViewer } from '../state/state-provider.js'

export type Subscribe<T> = (callback: (value: T) => void) => void

export type JobState<T> = {
	data: StateViewer<Optional<T>>
	error: StateViewer<Optional<Error>>
	isLoading: StateViewer<boolean>
	isReloading: StateViewer<boolean>
	reload: () => void
}

export type OnInitJob = <T, U>(
	callback: () => Promise<T>,
	...states: StateViewer<U>[]
) => JobState<T>
