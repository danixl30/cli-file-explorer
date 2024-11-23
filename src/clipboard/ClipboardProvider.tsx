import React, { ReactNode, createContext } from 'react'
import { useStateFactory } from '../core/infraestructure/state/useStateProvider.js'
import { clipboardLogic } from './logic/clipboard-logic.js'

export const ClipboardContext = createContext<
	ReturnType<typeof clipboardLogic>
>(undefined as unknown as any)

type ClipboardProviderProps = {
	children: ReactNode | ReactNode[]
}

export const ClipboardProvider = (props: ClipboardProviderProps) => {
	const data = clipboardLogic(useStateFactory)

	return (
		<ClipboardContext.Provider value={data}>
			{props.children}
		</ClipboardContext.Provider>
	)
}
