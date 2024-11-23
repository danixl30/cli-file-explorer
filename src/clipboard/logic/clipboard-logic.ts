import { StateFactory } from '../../core/application/state/state-factory.js'
import { Optional } from '../../core/utils/optional.js'
import { Node } from '../../file-display/types/node.js'

export type ClipboardItem = {
	items: Node[]
	opeation: 'COPY' | 'CUT'
}

export type ClipboardLogic = ReturnType<typeof clipboardLogic>

export const clipboardLogic = (stateFactory: StateFactory) => {
	const clipboardItemState = stateFactory<Optional<ClipboardItem>>(undefined)

	const removeItem = () => clipboardItemState.setState(undefined)

	const setItem = (item: ClipboardItem) => clipboardItemState.setState(item)

	return {
		item: clipboardItemState.state,
		removeItem,
		setItem,
	}
}
