import { lstatSync, readdirSync } from 'node:fs'
import { join, parse } from 'node:path'
import { list } from 'drivelist'
import { Optional } from '../../core/utils/optional.js'
import { GetAllFile } from '../services/get.all.files.js'
import { Node } from '../types/node.js'

export const getAllFiles: GetAllFile = async (path) => {
	if (path === '/' && process.platform === 'win32') {
		const drives = await list()
		return drives
			.map<Node[]>((e) =>
				e.mountpoints.map<Node>((mout) => ({
					path: mout.path.replace('\\', '/'),
					name: `(${mout.path.replace('\\', '')}) ${e.description}`,
					type: 'DRIVE',
				})),
			)
			.flat()
	}
	const nodes = readdirSync(path)
	return nodes
		.map((e) => e.replaceAll('\\', '/'))
		.map<Optional<Node>>((node) => {
			try {
				const nodePath = join(path, node).replaceAll('\\', '/')
				if (lstatSync(nodePath).isDirectory())
					return {
						path: nodePath,
						type: 'DIR',
						name: parse(node).base,
					}
				return {
					path: nodePath,
					type: 'FILE',
					name: parse(node).base,
				}
			} catch (_e) {
				return undefined
			}
		})
		.filter<Node>((e) => e != undefined)
		.reduce<Array<Array<Node>>>(
			(acc, e) => {
				if (e.type === 'FILE') return [acc[0]!, [...acc[1]!, e]]
				return [[...acc[0]!, e], acc[1]!]
			},
			[[], []] as Array<Array<Node>>,
		)
		.flat()
}
