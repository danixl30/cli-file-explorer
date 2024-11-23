import { exec } from 'node:child_process'
import { ExecuteCommandAsync } from '../services/execute.command.async.js'

export const executeCommandAsync: ExecuteCommandAsync = async (
	path,
	command,
) => {
	exec(command, {
		cwd: path,
	})
}
