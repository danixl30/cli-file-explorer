import { Node } from './node.js'

export type NodeDetails = Node & {
	size: number
	createdDate?: Date
	lastModifiedDate?: Date
	additionalData?: {
		available: number
		used: number
		percent: string
		fileSystem: string
		deviceType: 'USB' | 'VIRTUAL' | 'CARD' | 'REMOVABLE' | 'SCSI'
		partitionSchema: string
	}
}
