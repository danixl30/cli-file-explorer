import { existsSync } from 'node:fs'
import clipboardy from 'clipboardy'
import { Box, Text, useInput } from 'ink'
import React, { useContext, useRef, useState } from 'react'
import { AlertContext } from '../alerts/AlertContextProvider.js'
import { BookmarkPaneContext } from '../bookmark/context/BookmarkPaneContext.js'
import { createAddBookmarkItem } from '../bookmark/events/add.item.js'
import { ClipboardContext } from '../clipboard/ClipboardProvider.js'
import { EventContext } from '../core/infraestructure/event-handler/context/EventProvider.js'
import { nativeOnInitJob } from '../core/infraestructure/on-init-job/nativeOnInitJob.js'
import { useEffectOnInit } from '../core/infraestructure/on-init/useEffectOnInit.js'
import { useEffectStateObserver } from '../core/infraestructure/state-observer/useEffectStateObserver.js'
import { useRefStateFactory } from '../core/infraestructure/state/useRefStateProvider.js'
import { useRefValueProvider } from '../core/infraestructure/value-provider/useRefValueProvider.js'
import { InputContextCapture } from '../input-capture/InputContextCapture.js'
import { TabsContext } from '../tabs/TabsContext.js'
import { TabData } from '../tabs/logic/tabsManagerLogic.js'
import { TextFieldContextCapture } from '../text-field/TextFieldCaptureContext.js'
import { NodeDetails } from './components/NodeDetails.js'
import { NodeList } from './components/NodeList.js'
import { createNodeWrittenEvent } from './events/node.written.js'
import { createDirectory } from './implementation/create.dir.js'
import { deleteNode } from './implementation/delete.js'
import { executeCommandAsync } from './implementation/execute.command.async.js'
import { executeCommandSync } from './implementation/execute.command.sync.js'
import { executeFile } from './implementation/execute.file.js'
import { filterByGlobPattern } from './implementation/filter.glob.js'
import { getAllFiles } from './implementation/get.all.files.js'
import { getNextDir } from './implementation/get.directory.js'
import { getUpperDirectory } from './implementation/get.upper.directory.js'
import { moveNodeToTrash } from './implementation/move.trash.js'
import { pasteOperation } from './implementation/paste.operation.js'
import { renameNode } from './implementation/rename.js'
import { fileManagerLogic } from './logic/file.manager.js'
import { historyManager } from './logic/history.manager.js'
import { operationsManager } from './logic/operations.manager.js'
import { Node } from './types/node.js'

export default function FileDisplay(props: {
	initialData: TabData
	selection: Node[]
}) {
	const isInputEnable = useRef(true)
	const stateFactory = useRefStateFactory()
	const tabs = useContext(TabsContext)
	const alert = useContext(AlertContext)
	const inputCapture = useContext(InputContextCapture)
	const [index, setIndex] = useState(-1)
	const clipboard = useContext(ClipboardContext)
	const textField = useContext(TextFieldContextCapture)
	const eventHandler = useContext(EventContext)!
	const { isBookmarkEnabled } = useContext(BookmarkPaneContext)
	const history = historyManager(
		useRefValueProvider(),
		eventHandler,
		props.initialData.history,
	)
	const files = fileManagerLogic(
		stateFactory,
		useEffectStateObserver,
		eventHandler,
		nativeOnInitJob(stateFactory, useEffectStateObserver, useEffectOnInit),
		props.initialData.path,
		getAllFiles,
		getUpperDirectory,
		getNextDir,
		executeFile,
		history,
		props.selection,
		filterByGlobPattern,
	)
	const operations = operationsManager(
		files,
		clipboard,
		pasteOperation,
		deleteNode,
		renameNode,
		createDirectory,
		executeCommandSync,
		executeCommandAsync,
		moveNodeToTrash,
	)
	const filesList = files.files.value ?? []
	const moveUpArrow = () => {
		setIndex((prev) => {
			if (prev <= -1) return prev
			return prev - 1
		})
	}
	const moveDownArrow = () => {
		setIndex((prev) => {
			if (!filesList.length) return -1
			if (prev + 1 >= filesList.length) return filesList.length - 1
			return prev + 1
		})
	}
	const setCut = () => {
		if (index < 0 || index >= filesList.length) return
		if (filesList[index]?.type === 'DRIVE') return
		operations.cut(filesList[index]!)
		alert.setAlert({
			kind: 'INFO',
			message: 'File added to clipboard to cut',
		})
	}
	const setCopy = () => {
		if (index < 0 || index >= filesList.length) return
		if (filesList[index]?.type === 'DRIVE') return
		operations.copy(filesList[index]!)
		alert.setAlert({
			kind: 'INFO',
			message: 'File added to clipboard to copy',
		})
	}
	const executePaste = async (force: boolean) => {
		if (!clipboard.item.value) return
		isInputEnable.current = false
		alert.alertControlled({
			kind: 'INFO',
			message:
				clipboard.item.value.opeation === 'COPY'
					? 'Coping item...'
					: 'Cutting item...',
		})
		try {
			await operations.paste(force)
			alert.setAlert({
				message: 'Paste successfull',
				kind: 'SUCCESS',
			})
			eventHandler.publish(createNodeWrittenEvent())
		} catch (error: any) {
			alert.setAlert({
				kind: 'ERR',
				message: error.message,
			})
		}
		isInputEnable.current = true
	}
	const openDirInNewTab = () => {
		if (index < 0 || index >= filesList.length) return
		const node = filesList[index]!
		if (node.type === 'FILE') return
		tabs.addTab({
			path: node.path,
			history: {
				forward: [],
				previous: [],
			},
		})
	}
	const selectItem = () => {
		if (index === -1) files.gotToUpper()
		else if (filesList[index]) files.selectNode(filesList[index])
	}
	const deleteItem = () => {
		if (index < 0 || index >= filesList.length) return
		const node = filesList[index]!
		if (node.type === 'DRIVE') return
		inputCapture.addCallback(async (key) => {
			if (key !== 'Y') return
			isInputEnable.current = false
			alert.alertControlled({
				kind: 'INFO',
				message: 'Deleting item...',
			})
			try {
				await operations.removeNode(node)
				alert.setAlert({
					message: 'Delete successfull',
					kind: 'SUCCESS',
				})
				eventHandler.publish(createNodeWrittenEvent())
			} catch (error: any) {
				alert.setAlert({
					kind: 'ERR',
					message: error.message,
				})
			}
			isInputEnable.current = true
		}, 'Do you want to remove this item? Y/n')
	}
	const createDir = () => {
		if (filesList.some((e) => e.type === 'DRIVE')) return
		textField.addCallback({
			placeHolder: 'Set folder name',
			callback: {
				onSuccess: async (data) => {
					if (!data) return
					try {
						await operations.createDirectory(data)
						alert.setAlert({
							message: 'Folder created',
							kind: 'SUCCESS',
						})
					} catch (error: any) {
						alert.setAlert({
							kind: 'ERR',
							message: error.message,
						})
					}
				},
				onChange: (data) => {
					if (
						!data ||
						files.files.value?.some((e) => e.name === data)
					)
						textField.setError('Element already exist')
					else textField.setError('')
				},
			},
		})
	}
	const renameItem = () => {
		if (index < 0 || index >= filesList.length || selections.length) return
		const node = filesList[index]!
		if (node.type === 'DRIVE') return
		textField.addCallback({
			placeHolder: 'Set item name',
			defaultValue: node.name,
			text: 'Rename item name',
			callback: {
				onSuccess: async (data) => {
					if (!data) return
					try {
						await operations.rename(node, data)
						alert.setAlert({
							message: 'Item renamed',
							kind: 'SUCCESS',
						})
						eventHandler.publish(createNodeWrittenEvent())
					} catch (error: any) {
						alert.setAlert({
							kind: 'ERR',
							message: error.message,
						})
					}
				},
				onChange: (data) => {
					if (
						!data ||
						(data !== node.name &&
							files.files.value?.some((e) => e.name === data))
					)
						textField.setError('Element already exist')
					else textField.setError('')
				},
			},
		})
	}
	const toggleSelectItem = () => {
		if (index < 0 || index >= filesList.length) return
		const node = filesList[index]!
		if (node.type === 'DRIVE') return
		files.toggleSelected(node)
	}
	const selectToDetails = () => {
		if (index < 0 || index >= filesList.length) return
		const node = filesList[index]!
		files.selectNodeToDetails(node)
	}
	const addToBookmark = () => {
		if (index < 0 || index >= filesList.length) return
		const node = filesList[index]!
		if (node.type === 'FILE') return
		eventHandler.publish(createAddBookmarkItem(node))
	}
	const copyNodePathToClipboard = () => {
		if (index < 0 || index >= filesList.length) return
		const node = filesList[index]!
		clipboardy.writeSync(node.path)
		alert.setAlert({
			kind: 'INFO',
			message: 'Item path added to clipboard',
		})
	}
	const copyPathToClipboard = () => {
		clipboardy.writeSync(files.path.value)
		alert.setAlert({
			kind: 'INFO',
			message: 'Current dir path added to clipboard',
		})
	}
	const runCommandAsync = () => {
		textField.addCallback({
			placeHolder: 'Command in background...',
			callback: {
				onSuccess: async (command) => {
					await operations.runCommandAsync(command)
				},
				onChange: async () => {},
			},
		})
	}
	const runCommandSync = () => {
		textField.addCallback({
			placeHolder: 'Command blocking...',
			callback: {
				onSuccess: async (command) => {
					isInputEnable.current = false
					await operations
						.runCommandSync(command)
						.then((data) =>
							alert.setAlert({
								kind: 'INFO',
								message: data,
							}),
						)
						.catch((err) =>
							alert.setAlert({
								kind: 'ERR',
								message: err.message,
							}),
						)
					isInputEnable.current = true
				},
				onChange: async () => {},
			},
		})
	}
	const setPath = () => {
		textField.addCallback({
			placeHolder: 'Set path',
			defaultValue: files.path.value,
			text: 'Navigate to path',
			callback: {
				onSuccess: async (data) => {
					if (!data) return
					files.navigateTo(data)
				},
				onChange: (data) => {
					if (!existsSync(data)) textField.setError('Path not exist')
					else textField.setError('')
				},
			},
		})
	}
	const moveItemToTrash = () => {
		if (index < 0 || index >= filesList.length) return
		const node = filesList[index]!
		if (node.type === 'DRIVE') return
		inputCapture.addCallback(async (key) => {
			if (key !== 'y') return
			isInputEnable.current = false
			alert.alertControlled({
				kind: 'INFO',
				message: 'Moving item to trash...',
			})
			try {
				await operations.removeNode(node)
				alert.setAlert({
					message: 'Moved successfull',
					kind: 'SUCCESS',
				})
				eventHandler.publish(createNodeWrittenEvent())
			} catch (error: any) {
				alert.setAlert({
					kind: 'ERR',
					message: error.message,
				})
			}
			isInputEnable.current = true
		}, 'Do you want to move this item to trash? Y/n')
	}
	const setGlobPattern = () => {
		if (filesList.some((e) => e.type === 'DRIVE')) return
		textField.addCallback({
			placeHolder: 'Add glob pattern to search...',
			callback: {
				onChange() {},
				onSuccess(data) {
					files.selectByGlobPattern(data)
				},
			},
		})
	}
	useInput((input, key) => {
		if (
			!isInputEnable.current ||
			inputCapture.isInputEnabled ||
			textField.isInputEnabled ||
			isBookmarkEnabled
		)
			return
		if (key.ctrl && key.upArrow) files.gotToUpper()
		else if (key.ctrl && key.leftArrow) files.popHistory()
		else if (key.ctrl && key.rightArrow) files.forwardHistory()
		else if (key.upArrow) moveUpArrow()
		else if (key.downArrow) moveDownArrow()
		else if (key.ctrl && input === 'd') files.cleanNodeSelected()
		else if (input === 'S' && key.shift) addToBookmark()
		else if (input === 'i') selectToDetails()
		else if (input === 'a') createDir()
		else if (input === 'l' && key.ctrl) setPath()
		else if (input === 'R' && key.shift) renameItem()
		else if (input === 'd') moveItemToTrash()
		else if (input === 'D' && key.shift) deleteItem()
		else if (input === 'p') executePaste(false)
		else if (input === 'P' && key.shift) executePaste(true)
		else if (key.shift && input === 'T') openDirInNewTab()
		else if (input === 'C' && key.shift) setCut()
		else if (input === 'c') setCopy()
		else if (input === 'r') files.refresh()
		else if (key.shift && key.rightArrow) files.unSelectAll()
		else if (key.rightArrow) toggleSelectItem()
		else if (key.shift && input === 'A') files.selectAll()
		else if (key.shift && input === 'I') files.inevertSelection()
		else if (key.return) selectItem()
		else if (key.escape) clipboard.removeItem()
		else if (input === ';') runCommandAsync()
		else if (input === ':') runCommandSync()
		else if (input === 'y') copyNodePathToClipboard()
		else if (input === 'Y' && key.shift) copyPathToClipboard()
		else if (input === 'g') setGlobPattern()
	})
	if (files.isLoading.value)
		return (
			<Box width="100%" alignItems="center">
				<Text>Loading...</Text>
			</Box>
		)
	if (files.isError.value)
		return (
			<Box width="100%" alignItems="center">
				<Text>{files.isError.value.message}</Text>
			</Box>
		)
	const selections = files.selections.value
	return (
		<>
			<Box height="100%" flexDirection="row" borderStyle="round">
				<Box
					overflowY="hidden"
					flexDirection="column"
					width="100%"
					height="100%"
				>
					<Box width="100%" borderStyle="double">
						<Text>{files.path.value}</Text>
					</Box>
					<NodeList
						nodes={files.files.value!}
						index={index}
						isTabs={tabs.tabs.value.length > 1}
						selections={files.selections.value}
					/>
				</Box>
				{files.selectedNode.value && (
					<NodeDetails node={files.selectedNode.value} />
				)}
			</Box>
		</>
	)
}
