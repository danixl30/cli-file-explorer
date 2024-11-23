import { Alert, Badge } from '@inkjs/ui'
import { Box } from 'ink'
import React, { useContext } from 'react'
import { ClipboardContext } from '../../clipboard/ClipboardProvider.js'
import { AlertContext } from '../AlertContextProvider.js'

export const AlertDisplay = () => {
	const alert = useContext(AlertContext)
	const clipboard = useContext(ClipboardContext)

	return (
		<>
			<Box width="100%" flexDirection="column">
				{clipboard.item.value && (
					<Box>
						<Badge color="blue">
							{clipboard.item.value.items.length} items in
							clipboard
						</Badge>
					</Box>
				)}
				{alert.alert.value?.kind === 'ERR' && (
					<Alert variant="error">{alert.alert.value.message}</Alert>
				)}
				{alert.alert.value?.kind === 'WARN' && (
					<Alert variant="warning">{alert.alert.value.message}</Alert>
				)}
				{alert.alert.value?.kind === 'INFO' && (
					<Alert variant="info">{alert.alert.value.message}</Alert>
				)}
				{alert.alert.value?.kind === 'SUCCESS' && (
					<Alert variant="success">{alert.alert.value.message}</Alert>
				)}
			</Box>
		</>
	)
}
