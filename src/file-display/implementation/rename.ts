import { renameSync } from 'node:fs'
import { join } from 'node:path'
import { RenameNode } from '../services/remane.js'

export const renameNode: RenameNode = async (node, newName) => {
	const basePath = node.path.split('/').toSpliced(-1, 1).join('/')
	renameSync(node.path, join(basePath, `/${newName}`))
}
