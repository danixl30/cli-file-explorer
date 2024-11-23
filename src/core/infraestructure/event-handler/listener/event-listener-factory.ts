import { EventHandler } from '../../../application/event-handler/event-handler.js'
import { EventListener } from '../../../application/event-handler/listener/event-listener.js'
import { EventBase } from '../../../application/event-handler/types/event.js'
import { OnInit } from '../../../application/on-init/on-init.js'

export const eventListenerFactory =
	(onInit: OnInit, eventHandler: EventHandler): EventListener =>
	<T extends EventBase>(event: string, callback: (event: T) => void) => {
		onInit(() => {
			const subscription = eventHandler.subscribe(event, callback)
			return () => {
				subscription()
			}
		})
	}
