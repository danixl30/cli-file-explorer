import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import trash from 'trash'
import { DeleteNode } from '../services/delete.js'

export const moveNodeToTrash: DeleteNode = async (node) => {
	if (process.platform === 'win32')
		execSync(`recycle -f ${resolve(node.path)}`)
	else await trash(node.path)
}
