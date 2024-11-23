import { StateViewer } from '../../state/state-provider.js'

export type InputManagerResult<T> = {
	value: StateViewer<T>
	error: StateViewer<string>
	onChange(data: T): void
}
