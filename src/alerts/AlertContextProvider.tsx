import React, { ReactNode, createContext } from 'react'
import { timerManager } from '../core/application/timer/timer.js'
import { useEffectStateObserver } from '../core/infraestructure/state-observer/useEffectStateObserver.js'
import { useRefStateFactory } from '../core/infraestructure/state/useRefStateProvider.js'
import { setTimeoutSleep } from '../core/infraestructure/timer/sleep.js'
import { useRefValueProvider } from '../core/infraestructure/value-provider/useRefValueProvider.js'
import { alertLogic } from './logic/alert.logic.js'

export const AlertContext = createContext<ReturnType<typeof alertLogic>>(
	undefined as unknown as any,
)

type AlertContextProviderProps = {
	children: ReactNode | ReactNode[]
	time?: number
}

export const AlertContextProvider = (props: AlertContextProviderProps) => {
	const stateFactory = useRefStateFactory()
	const data = alertLogic(
		stateFactory,
		timerManager(
			stateFactory,
			useRefValueProvider(),
			useEffectStateObserver,
			props.time || 2000,
			setTimeoutSleep,
		),
	)

	return (
		<AlertContext.Provider value={data}>
			{props.children}
		</AlertContext.Provider>
	)
}
