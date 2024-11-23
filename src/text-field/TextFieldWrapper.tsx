import { StatusMessage, TextInput } from '@inkjs/ui'
import { Box, useInput } from 'ink'
import React, { useContext } from 'react'
import { TextFieldContextCapture } from './TextFieldCaptureContext.js'

export const TextFieldWrapper = () => {
	const textField = useContext(TextFieldContextCapture)
	useInput((_input, key) => {
		if (key.escape) textField.cleanUp()
	})
	if (!textField.isInputEnabled) return <></>
	return (
		<Box borderStyle="classic" flexDirection="column" gap={1}>
			<TextInput
				defaultValue={textField.data?.defaultValue}
				onChange={textField.data?.callback.onChange}
				placeholder={textField.data?.placeHolder}
				onSubmit={(data) => {
					textField.cleanUp()
					if (!textField.error)
						textField.data?.callback.onSuccess(data)
				}}
			/>
			{textField.data?.text && !textField.error && (
				<StatusMessage variant="info">
					{textField.data.text}
				</StatusMessage>
			)}
			{textField.error && (
				<StatusMessage variant="error">{textField.error}</StatusMessage>
			)}
		</Box>
	)
}
