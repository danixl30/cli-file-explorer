import { randomUUID } from 'node:crypto'
import { EventBase } from '../../core/application/event-handler/types/event.js'
import { TabData } from '../logic/tabsManagerLogic.js'

export type UpdateTabData = EventBase & TabData

export const UPDATE_TAB_DATA = 'UPDATE_TAB_DATA'

export const createUpdateTabDataEvent = (data: TabData): UpdateTabData => ({
	...data,
	id: randomUUID(),
	name: UPDATE_TAB_DATA,
	timestamp: new Date(),
})
