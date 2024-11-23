import { existsSync } from 'node:fs'
import { GetNextDirectory } from '../services/get.directory.js'

export const getNextDir: GetNextDirectory = async (node) => {
	if (node.type === 'DRIVE') return node.path
	if (!existsSync(node.path)) throw new Error('Directory not exist')
	return node.path
}
