import { spawnSync } from 'node:child_process'
import { ExecuteCommandSync } from '../services/execute.command.sync.js'

export const executeCommandSync: ExecuteCommandSync = async (path, command) => {
	spawnSync(command, {
		cwd: path,
		stdio: 'inherit',
		shell: true,
	})
	return 'Command executed'
}
