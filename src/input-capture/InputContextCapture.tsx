import { useInput } from 'ink'
import React, { createContext, ReactNode, useRef, useState } from 'react'
import { Optional } from '../core/utils/optional.js'

type Callback = (input: string) => any

export const InputContextCapture = createContext<{
	text: string
	isInputEnabled: boolean
	addCallback(callback: Callback, text: string): void
}>(undefined as unknown as any)

type InputContextCaptureProviderProps = {
	children: ReactNode | ReactNode[]
}

export const InputContextCaptureProvider = (
	props: InputContextCaptureProviderProps,
) => {
	const callback = useRef<Optional<Callback>>(undefined)
	const [isInputEnabled, setInputEnable] = useState(false)
	const [text, setText] = useState('')

	const addCallback = (c: Callback, text: string) => {
		callback.current = c
		setInputEnable(true)
		setText(text)
	}

	useInput((input) => {
		if (!isInputEnabled) return
		callback.current?.(input)
		callback.current = undefined
		setInputEnable(false)
		setText('')
	})
	return (
		<InputContextCapture.Provider
			value={{
				addCallback,
				text,
				isInputEnabled,
			}}
		>
			{props.children}
		</InputContextCapture.Provider>
	)
}
