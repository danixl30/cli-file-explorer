import { ArgumentType } from '../../../utils/argument.type.js'
import { Optional } from '../../../utils/optional.js'
import { StateViewer } from '../../state/state-provider.js'

export type OnTask = () => {
	success?: () => void
	error?: (error: Error) => void
}

export type JobStateLazy<T, U extends (...args: any[]) => any> = {
	data: StateViewer<Optional<T>>
	error: StateViewer<Optional<Error>>
	isLoading: StateViewer<boolean>
	do: (...args: ArgumentType<U>) => Promise<T>
}

export type OnInitJobLazy = <T, U extends (...args: any[]) => any>(
	callback: (...args: ArgumentType<U>) => Promise<T>,
	onTask?: OnTask,
) => JobStateLazy<T, U>
