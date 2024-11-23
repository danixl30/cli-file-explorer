import { Optional } from '../../../utils/optional.js'
import { StateViewer } from '../../state/state-provider.js'

export type PaginationResult<T> = {
	data: StateViewer<T[]>
	error: StateViewer<Optional<Error>>
	isLoading: StateViewer<boolean>
	page: StateViewer<number>
	isTop: StateViewer<boolean>
	reset(): void
	increment(): void
	previousPage(): void
	setPage(page: number): void
}
