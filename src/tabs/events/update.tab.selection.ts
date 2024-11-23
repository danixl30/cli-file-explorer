import { randomUUID } from 'node:crypto'
import { EventBase } from '../../core/application/event-handler/types/event.js'
import { Node } from '../../file-display/types/node.js'

export type UpdateTabSelection = EventBase & {
	selection: Node[]
}

export const createUpdateTabSelectionEvent = (
	selection: Node[],
): UpdateTabSelection => ({
	selection,
	id: randomUUID(),
	name: UPDATE_TAB_SELECTION,
	timestamp: new Date(),
})

export const UPDATE_TAB_SELECTION = 'UPDATE_TAB_SELECTION'
