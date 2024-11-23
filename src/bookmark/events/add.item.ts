import { randomUUID } from 'node:crypto'
import { EventBase } from '../../core/application/event-handler/types/event.js'
import { Node } from '../../file-display/types/node.js'

export type AddBookmarkItem = EventBase & {
	item: Node
}

export const createAddBookmarkItem = (item: Node): AddBookmarkItem => ({
	id: randomUUID(),
	item,
	name: ADD_BOOKMARK_ITEM,
	timestamp: new Date(),
})

export const ADD_BOOKMARK_ITEM = 'ADD_BOOKMARK_ITEM'
