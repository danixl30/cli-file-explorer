import React, { createContext, ReactNode, useRef, useState } from 'react'
import { Optional } from '../core/utils/optional.js'

type Callback = {
	onSuccess: (data: string) => any
	onChange: (data: string) => any
}

type TextFieldData = {
	callback: Callback
	placeHolder: string
	defaultValue?: string
	text?: string
}

export const TextFieldContextCapture = createContext<{
	data: Optional<TextFieldData>
	isInputEnabled: boolean
	addCallback(data: TextFieldData): void
	error: string
	setError(msg: string): void
	cleanUp(): void
}>(undefined as unknown as any)

type TextFieldContextCaptureProviderProps = {
	children: ReactNode | ReactNode[]
}

export const TextFieldContextCaptureProvider = (
	props: TextFieldContextCaptureProviderProps,
) => {
	const textFieldData = useRef<Optional<TextFieldData>>(undefined)
	const [isInputEnabled, setInputEnable] = useState(false)
	const [error, setError] = useState('')

	const addCallback = (data: TextFieldData) => {
		textFieldData.current = data
		setInputEnable(true)
	}

	const cleanUp = () => {
		textFieldData.current = undefined
		setInputEnable(false)
		setError('')
	}

	return (
		<TextFieldContextCapture.Provider
			value={{
				addCallback,
				isInputEnabled,
				error,
				setError,
				data: textFieldData.current,
				cleanUp,
			}}
		>
			{props.children}
		</TextFieldContextCapture.Provider>
	)
}
