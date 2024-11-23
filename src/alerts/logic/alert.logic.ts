import { StateFactory } from '../../core/application/state/state-factory.js'
import { TimerManager } from '../../core/application/timer/timer.js'
import { Optional } from '../../core/utils/optional.js'

export type Alert = {
	message: string
	kind: 'WARN' | 'ERR' | 'INFO' | 'SUCCESS'
}

export const alertLogic = (stateFactory: StateFactory, timer: TimerManager) => {
	const alertState = stateFactory<Optional<Alert>>(undefined)

	const setAlert = (alert: Alert) => {
		alertState.setState(alert)
		timer(() => alertState.setState(undefined))
	}

	const alertControlled = (alert: Alert) => {
		alertState.setState(alert)
		return () => alertState.setState(undefined)
	}

	return {
		alert: alertState.state,
		alertControlled,
		setAlert,
	}
}
