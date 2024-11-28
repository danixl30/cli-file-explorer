import { ClipboardLogic } from '../../clipboard/logic/clipboard-logic.js'
import { CreateDirectory } from '../services/create.dir.js'
import { DeleteNode } from '../services/delete.js'
import { ExecuteCommandAsync } from '../services/execute.command.async.js'
import { ExecuteCommandSync } from '../services/execute.command.sync.js'
import { MoveTrash } from '../services/move.trash.js'
import { PasteOperation } from '../services/paste.operation.js'
import { RenameNode } from '../services/remane.js'
import { Node } from '../types/node.js'
import { FileManagerLogic } from './file.manager.js'

export const operationsManager = (
	fileManager: FileManagerLogic,
	clipboard: ClipboardLogic,
	pasteOperation: PasteOperation,
	deleteNode: DeleteNode,
	renameNode: RenameNode,
	createDir: CreateDirectory,
	executeCommandSync: ExecuteCommandSync,
	executeCommandAsync: ExecuteCommandAsync,
	moveToTrash: MoveTrash,
) => {
	const paste = async (replace: boolean) => {
		if (!clipboard.item.value) return
		if (fileManager.files.value?.some((e) => e.type === 'DRIVE'))
			throw new Error(`Can't past outside a drive`)
		await pasteOperation(
			clipboard.item.value,
			fileManager.path.value,
			replace,
		)
		clipboard.removeItem()
		fileManager.cleanNodeSelected()
		fileManager.refresh()
	}

	const copy = (node: Node) => {
		if (node.type === 'DRIVE') return
		clipboard.setItem({
			items:
				fileManager.selections.value.length === 0
					? [node]
					: fileManager.selections.value,
			opeation: 'COPY',
		})
	}

	const cut = (node: Node) => {
		if (node.type === 'DRIVE') return
		clipboard.setItem({
			items:
				fileManager.selections.value.length === 0
					? [node]
					: fileManager.selections.value,
			opeation: 'CUT',
		})
	}

	const removeNode = async (node: Node) => {
		const clipboardItem = clipboard.item.value
		if (fileManager.selections.value.length > 0) {
			if (
				clipboardItem?.items.some((e) =>
					fileManager.selections.value.some(
						(node) => e.path === node.path,
					),
				)
			)
				throw new Error(
					`Can't delete the item that you set on clipboard`,
				)
			if (fileManager.selections.value.some((e) => e.type === 'DRIVE'))
				throw new Error('you can not remove a drive')
			await Promise.all(
				fileManager.selections.value.map((node) => deleteNode(node)),
			)
			fileManager.refresh()
			return
		}
		if (clipboardItem?.items.some((e) => e.path === node.path))
			throw new Error(`Can't delete the item that you set on clipboard`)
		if (node.type === 'DRIVE') throw new Error('you can not remove a drive')
		await deleteNode(node)
		fileManager.cleanNodeSelected()
		fileManager.refresh()
	}

	const moveNodeToTrash = async (node: Node) => {
		const clipboardItem = clipboard.item.value
		if (fileManager.selections.value.length > 0) {
			if (
				clipboardItem?.items.some((e) =>
					fileManager.selections.value.some(
						(node) => e.path === node.path,
					),
				)
			)
				throw new Error(
					`Can't delete the item that you set on clipboard`,
				)
			if (fileManager.selections.value.some((e) => e.type === 'DRIVE'))
				throw new Error('you can not remove a drive')
			await Promise.all(
				fileManager.selections.value.map((node) =>
					moveNodeToTrash(node),
				),
			)
			fileManager.refresh()
			return
		}
		if (clipboardItem?.items.some((e) => e.path === node.path))
			throw new Error(`Can't delete the item that you set on clipboard`)
		if (node.type === 'DRIVE') throw new Error('you can not remove a drive')
		await moveToTrash(node)
		fileManager.cleanNodeSelected()
		fileManager.refresh()
	}

	const rename = async (node: Node, newName: string) => {
		const clipboardItem = clipboard.item.value
		if (clipboardItem?.items.some((e) => e.path === node.path))
			throw new Error(`Can't rename item that you set on clipboard`)
		if (node.type === 'DRIVE') throw new Error('you can not rename a drive')
		await renameNode(node, newName)
		fileManager.cleanNodeSelected()
		fileManager.refresh()
	}

	const createDirectory = async (name: string) => {
		if (fileManager.files.value?.some((e) => e.type === 'DRIVE'))
			throw new Error(`Can't create a folder outside a drive`)
		await createDir(fileManager.path.value, name)
		fileManager.refresh()
	}

	const runCommandAsync = async (command: string) =>
		executeCommandAsync(fileManager.path.value, command)

	const runCommandSync = async (command: string) => {
		const data = await executeCommandSync(fileManager.path.value, command)
		fileManager.refresh()
		return data
	}

	return {
		paste,
		copy,
		rename,
		removeNode,
		createDirectory,
		cut,
		runCommandAsync,
		runCommandSync,
		moveNodeToTrash,
	}
}
