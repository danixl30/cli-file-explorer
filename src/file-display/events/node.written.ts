import { randomUUID } from 'node:crypto'
import { EventBase } from '../../core/application/event-handler/types/event.js'

export type NodeWritten = EventBase

export const createNodeWrittenEvent = (): NodeWritten => ({
	id: randomUUID(),
	name: NODE_WRITTEN,
	timestamp: new Date(),
})

export const NODE_WRITTEN = 'NODE_WRITTEN'
