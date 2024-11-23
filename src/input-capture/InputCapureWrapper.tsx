import { Box, Text } from 'ink'
import React, { useContext } from 'react'
import { InputContextCapture } from './InputContextCapture.js'

export const InputCaptureWarpper = () => {
	const inputCapture = useContext(InputContextCapture)

	if (!inputCapture.isInputEnabled) return <></>

	return (
		<Box borderStyle="classic">
			<Text>{inputCapture.text}</Text>
		</Box>
	)
}
