import { rmSync, unlinkSync } from 'node:fs'
import { DeleteNode } from '../services/delete.js'

export const deleteNode: DeleteNode = async (node) => {
	if (node.type === 'FILE') unlinkSync(node.path)
	if (node.type === 'DIR')
		rmSync(node.path, {
			recursive: true,
		})
}
