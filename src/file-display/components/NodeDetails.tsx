import { Alert, Spinner } from '@inkjs/ui'
import { Box, Text } from 'ink'
import React from 'react'
import { nativeOnInitJob } from '../../core/infraestructure/on-init-job/nativeOnInitJob.js'
import { useEffectOnInit } from '../../core/infraestructure/on-init/useEffectOnInit.js'
import { useEffectStateObserver } from '../../core/infraestructure/state-observer/useEffectStateObserver.js'
import { useRefStateFactory } from '../../core/infraestructure/state/useRefStateProvider.js'
import { getNodeDetails } from '../implementation/node.details.js'
import { nodeDetailLogic } from '../logic/node.detail.js'
import { Node } from '../types/node.js'
import { getNodeIcon } from '../utils/icon.parser.js'

function formatBytes(bytes: number, decimals = 2) {
	if (!+bytes) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const NodeDetails = (props: {
	node: Node
}) => {
	const details = nodeDetailLogic(
		props.node,
		nativeOnInitJob(
			useRefStateFactory(),
			useEffectStateObserver,
			useEffectOnInit,
		),
		getNodeDetails(),
	)
	if (details.error.value)
		return <Alert variant="error">{details.error.value.message}</Alert>
	if (details.isLoading.value || !details.data.value)
		return (
			<Box
				borderStyle="single"
				width="100%"
				alignItems="stretch"
				flexDirection="row"
			>
				<Spinner label="Loading..." />
			</Box>
		)
	return (
		<Box borderStyle="single" flexDirection="column" width="50%">
			<Text>{'Path: ' + details.data.value!.path}</Text>
			<Text>
				{'Name: ' +
					getNodeIcon(details.data.value) +
					details.data.value!.name}
			</Text>
			<Text>{'Size: ' + formatBytes(details.data.value!.size)}</Text>
			{details.data.value.createdDate && (
				<Text>
					{'Created at: ' +
						details.data.value!.createdDate.toLocaleString()}
				</Text>
			)}
			{details.data.value.lastModifiedDate && (
				<Text>
					{'Last modified: ' +
						details.data.value!.lastModifiedDate.toLocaleString()}
				</Text>
			)}
			{details.data.value.additionalData && (
				<>
					<Text>
						{'Available: ' +
							formatBytes(
								details.data.value.additionalData.available,
							)}
					</Text>
					<Text>
						{'Used: ' +
							formatBytes(details.data.value.additionalData.used)}
					</Text>
					<Text>
						{'Percent occupied: ' +
							details.data.value.additionalData.percent}
					</Text>
					<Text>
						{'Partition schema: ' +
							details.data.value.additionalData.partitionSchema}
					</Text>
					<Text>
						{'File system: ' +
							details.data.value.additionalData.fileSystem}
					</Text>
					<Text>
						{'Device type: ' +
							details.data.value.additionalData.deviceType}
					</Text>
				</>
			)}
		</Box>
	)
}
