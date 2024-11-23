import { EventHandler } from '../../core/application/event-handler/event-handler.js'
import { OnInitJob } from '../../core/application/on-init-job/on-init-job.js'
import { StateObserver } from '../../core/application/state-observers/state-observer.js'
import { StateFactory } from '../../core/application/state/state-factory.js'
import { Optional } from '../../core/utils/optional.js'
import { createUpdateTabSelectionEvent } from '../../tabs/events/update.tab.selection.js'
import { ExecuteFile } from '../services/execute.file.js'
import { FilterByGlobPattern } from '../services/filter.glob.js'
import { GetAllFile } from '../services/get.all.files.js'
import { GetNextDirectory } from '../services/get.directory.js'
import { GetUpperDirectory } from '../services/get.upper.directory.js'
import { Node } from '../types/node.js'
import { HistoryManager } from './history.manager.js'

export type FileManagerLogic = ReturnType<typeof fileManagerLogic>

export const fileManagerLogic = (
	stateProvider: StateFactory,
	stateObserver: StateObserver,
	eventHandler: EventHandler,
	onInitJob: OnInitJob,
	path: string,
	getAllFiles: GetAllFile,
	uppderDir: GetUpperDirectory,
	nextDir: GetNextDirectory,
	executeFile: ExecuteFile,
	history: HistoryManager,
	selection: Node[],
	filterByGlobPattern: FilterByGlobPattern,
) => {
	const pathState = stateProvider(path)
	const selectionsState = stateProvider<Node[]>(selection)
	const selectedNode = stateProvider<Optional<Node>>(undefined)
	const filePaginated = onInitJob(
		() => getAllFiles(pathState.state.value),
		pathState.state,
	)

	const toggleSelected = (node: Node) => {
		if (selectionsState.state.value.some((e) => e.path === node.path))
			selectionsState.setState(
				selectionsState.state.value.filter((e) => e.path !== node.path),
			)
		else selectionsState.setState([...selectionsState.state.value, node])
	}

	const inevertSelection = () => {
		selectionsState.setState(
			filePaginated.data.value!.filter(
				(e) =>
					!selectionsState.state.value.some(
						(node) => e.path === node.path,
					) && e.type !== 'DRIVE',
			),
		)
	}

	const selectAll = () => {
		selectionsState.setState(
			filePaginated.data.value!.filter((e) => e.type !== 'DRIVE'),
		)
	}

	const unSelectAll = () => {
		selectionsState.setState([])
	}

	const selectNode = async (node: Node) => {
		if (filePaginated.isLoading.value || filePaginated.isReloading.value)
			return
		if (node.type === 'DIR' || node.type === 'DRIVE') {
			const nextPath = await nextDir(node)
			const prevPath = pathState.state.value
			pathState.setState(nextPath)
			history.push(nextPath, prevPath)
			return
		}
		await executeFile(node)
	}

	const gotToUpper = async () => {
		if (filePaginated.isLoading.value) return
		const nextPath = await uppderDir(pathState.state.value)
		if (!nextPath) return
		const prevPath = pathState.state.value
		pathState.setState(nextPath)
		history.push(pathState.state.value, prevPath)
	}

	const popHistory = () => {
		if (filePaginated.isLoading.value) return
		const nextPath = history.pop(pathState.state.value)
		if (!nextPath) return
		pathState.setState(nextPath)
	}

	const forwardHistory = () => {
		if (filePaginated.isLoading.value) return
		const nextPath = history.forward(pathState.state.value)
		if (!nextPath) return
		pathState.setState(nextPath)
	}

	const refresh = () => filePaginated.reload()

	const selectNodeToDetails = (node: Node) => {
		selectedNode.setState(node)
	}

	const cleanNodeSelected = () => {
		selectedNode.setState(undefined)
	}

	const navigateTo = (path: string) => {
		const prevPath = pathState.state.value
		pathState.setState(path)
		history.push(pathState.state.value, prevPath)
	}

	const selectByGlobPattern = (pattern: string) => {
		selectionsState.setState(
			filterByGlobPattern(
				filePaginated.data.value!.filter((e) => e.type !== 'DRIVE'),
				pattern,
			),
		)
	}

	stateObserver(() => {
		if (!filePaginated.data.value) return
		selectionsState.setState(
			selectionsState.state.value.filter((e) =>
				filePaginated.data.value!.some((node) => e.path === node.path),
			),
		)
	}, filePaginated.data)

	stateObserver(() => {
		selectionsState.setState([])
	}, pathState.state)

	stateObserver(() => {
		eventHandler.publish(
			createUpdateTabSelectionEvent(selectionsState.state.value),
		)
	}, selectionsState.state)

	return {
		files: filePaginated.data,
		isLoading: filePaginated.isLoading,
		isError: filePaginated.error,
		forwardHistory,
		popHistory,
		selectNode,
		refresh,
		path: pathState.state,
		gotToUpper,
		selections: selectionsState.state,
		toggleSelected,
		selectAll,
		inevertSelection,
		unSelectAll,
		selectedNode: selectedNode.state,
		selectNodeToDetails,
		navigateTo,
		cleanNodeSelected,
		selectByGlobPattern,
	}
}
