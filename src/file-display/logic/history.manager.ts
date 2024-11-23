import { EventHandler } from '../../core/application/event-handler/event-handler.js'
import { ValueProvider } from '../../core/application/value-provider/value-provider.js'
import { createUpdateTabDataEvent } from '../../tabs/events/update.tab.data.js'
import { TabHistoryData } from '../../tabs/logic/tabsManagerLogic.js'

export type HistoryManager = ReturnType<typeof historyManager>

export const historyManager = (
	valueProvider: ValueProvider,
	eventHandler: EventHandler,
	historyInitial: TabHistoryData,
) => {
	const backHitory = valueProvider<string[]>(historyInitial.previous)
	const forwardHistory = valueProvider<string[]>(historyInitial.forward)

	const push = (path: string, currentPath: string) => {
		backHitory.value.push(currentPath)
		forwardHistory.value = []
		eventHandler.publish(
			createUpdateTabDataEvent({
				path: path,
				history: {
					previous: backHitory.value,
					forward: forwardHistory.value,
				},
			}),
		)
	}

	const pop = (currentPath: string) => {
		const path = backHitory.value.pop()
		if (path) forwardHistory.value.push(currentPath)
		eventHandler.publish(
			createUpdateTabDataEvent({
				path: path ?? currentPath,
				history: {
					previous: backHitory.value,
					forward: forwardHistory.value,
				},
			}),
		)
		return path
	}

	const forward = (currentPath: string) => {
		const path = forwardHistory.value.pop()
		if (path) backHitory.value.push(currentPath)
		eventHandler.publish(
			createUpdateTabDataEvent({
				path: path ?? currentPath,
				history: {
					previous: backHitory.value,
					forward: forwardHistory.value,
				},
			}),
		)
		return path
	}

	return {
		push,
		pop,
		forward,
	}
}
