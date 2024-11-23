import {
	copyFileSync,
	cpSync,
	existsSync,
	lstatSync,
	renameSync,
} from 'node:fs'
import { join, parse } from 'node:path'
import { ClipboardItem } from '../../clipboard/logic/clipboard-logic.js'
import { PasteOperation } from '../services/paste.operation.js'
import { Node } from '../types/node.js'

const generateFilename = (data: Node, path: string) => {
	const name = parse(data.path)
	const numberGenerator = (index: number = 1) => {
		if (data.type === 'FILE') {
			if (existsSync(join(path, name.name + ` (${index})` + name.ext)))
				return numberGenerator(++index)
			return name.name + ` (${index})` + name.ext
		}
		if (existsSync(join(path, name.base + ` (${index})`)))
			return numberGenerator(++index)
		return name.base + ` (${index})`
	}
	if (existsSync(join(path, name.base))) return numberGenerator()
	return name.base
}

const pasteWorker = (
	data: Node,
	destinate: string,
	operation: ClipboardItem['opeation'],
	replace: boolean,
) => {
	const filename = replace
		? parse(data.path).base
		: generateFilename(data, destinate)
	if (operation === 'CUT') {
		renameSync(data.path, join(destinate, `/${filename}`))
	}
	if (operation === 'COPY' && data.type === 'FILE') {
		copyFileSync(data.path, join(destinate, `/${filename}`))
	}
	if (operation === 'COPY' && data.type === 'DIR') {
		cpSync(data.path, join(destinate, `/${filename}`), {
			recursive: true,
			force: true,
		})
	}
}

export const pasteOperation: PasteOperation = async (
	data,
	destinate,
	replace,
) => {
	if (!lstatSync(destinate).isDirectory())
		throw new Error('The destinate must be a directory')
	data.items.map((node) =>
		pasteWorker(node, destinate, data.opeation, replace),
	)
}
