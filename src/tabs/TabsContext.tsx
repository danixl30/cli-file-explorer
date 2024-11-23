import React, { ReactNode, createContext, useContext } from 'react'
import { EventContext } from '../core/infraestructure/event-handler/context/EventProvider.js'
import { useEffectOnInit } from '../core/infraestructure/on-init/useEffectOnInit.js'
import { useRefStateFactory } from '../core/infraestructure/state/useRefStateProvider.js'
import { useRefValueProvider } from '../core/infraestructure/value-provider/useRefValueProvider.js'
import { tabsManagerLogic } from './logic/tabsManagerLogic.js'

export const TabsContext = createContext<ReturnType<typeof tabsManagerLogic>>(
	undefined as unknown as any,
)

type TabsContextProviderProps = {
	children: ReactNode | ReactNode[]
	defaultPath: string
}

export const TabsContextProvider = (props: TabsContextProviderProps) => {
	const data = tabsManagerLogic(
		useRefStateFactory(),
		useRefValueProvider(),
		() => ({
			path: props.defaultPath,
			history: {
				previous: [],
				forward: [],
			},
		}),
		useEffectOnInit,
		useContext(EventContext)!,
	)

	return (
		<TabsContext.Provider value={data}>
			{props.children}
		</TabsContext.Provider>
	)
}
