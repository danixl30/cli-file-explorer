import { EventBase } from './types/event.js'
import { Subscription } from './types/subscription.js'

export type EventHandler = {
	subscribe<T extends EventBase>(
		event: string,
		callback: (event: T) => void,
	): Subscription
	publish(event: EventBase): void
}
