import { EventBase } from '../types/event.js'

export type EventListener = <T extends EventBase>(
	event: string,
	callback: (event: T) => void,
) => void
