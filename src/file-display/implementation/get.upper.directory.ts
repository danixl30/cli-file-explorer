import { existsSync } from 'node:fs'
import { GetUpperDirectory } from '../services/get.upper.directory.js'

export const getUpperDirectory: GetUpperDirectory = async (path) => {
	if (path === '/') return path
	if (
		path.split('/').length === 2 &&
		path.endsWith('/') &&
		process.platform === 'win32'
	)
		return '/'
	let pathToSearch = path.split('/').toSpliced(-1, 1).join('/')
	if (process.platform === 'win32' && !path) return '/'
	if (pathToSearch.split('/').length === 1 && process.platform === 'win32')
		pathToSearch = pathToSearch + '/'
	if (!existsSync(pathToSearch)) return path
	return pathToSearch
}
