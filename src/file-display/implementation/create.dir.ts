import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { CreateDirectory } from '../services/create.dir.js'

export const createDirectory: CreateDirectory = async (path, dir) => {
	mkdirSync(join(path, '/' + dir), {
		recursive: true,
	})
}
