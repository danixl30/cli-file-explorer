import { exec } from 'node:child_process'
import { ExecuteFile } from '../services/execute.file.js'

export const executeFile: ExecuteFile = async (node) => {
	exec(node.path)
}
