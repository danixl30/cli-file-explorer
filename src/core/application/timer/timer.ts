import { Optional } from '../../utils/optional.js'
import { StateObserver } from '../state-observers/state-observer.js'
import { StateFactory } from '../state/state-factory.js'
import { ValueProvider } from '../value-provider/value-provider.js'
import { Sleep } from './sleep/sleep.js'

export type TimerManager = (callback: () => any) => void

export const timerManager = (
	stateFactory: StateFactory,
	valueProvider: ValueProvider,
	stateObserver: StateObserver,
	time: number,
	sleep: Sleep,
): TimerManager => {
	const callBackState = stateFactory<Optional<() => any>>(undefined)
	const currentCallback = valueProvider<Optional<() => any>>(undefined)

	const worker = async () => {
		await sleep(time)
		callBackState.state.value?.()
		callBackState.setState(undefined)
	}

	const addCallback = (callback: () => any) => {
		currentCallback.value = callBackState.state.value
		callBackState.setState(callback)
	}

	stateObserver(() => {
		if (callBackState.state.value) worker()
		return () => worker()
	}, callBackState.state)

	return addCallback
}
