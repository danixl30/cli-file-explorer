import { EventHandler } from '../../core/application/event-handler/event-handler.js'
import { OnInit } from '../../core/application/on-init/on-init.js'
import { StateFactory } from '../../core/application/state/state-factory.js'
import { ValueProvider } from '../../core/application/value-provider/value-provider.js'
import { Node } from '../../file-display/types/node.js'
import { UPDATE_TAB_DATA, UpdateTabData } from '../events/update.tab.data.js'
import {
	UPDATE_TAB_SELECTION,
	UpdateTabSelection,
} from '../events/update.tab.selection.js'

export type TabHistoryData = {
	previous: string[]
	forward: string[]
}

export type TabData = {
	path: string
	history: TabHistoryData
}

export const tabsManagerLogic = (
	stateFactory: StateFactory,
	valueProvider: ValueProvider,
	createTab: () => TabData,
	onInit: OnInit,
	eventHandler: EventHandler,
) => {
	const tabsState = stateFactory<TabData[]>([createTab()])
	const selectionInTabs = valueProvider<Node[][]>([])
	const indexState = stateFactory<number>(0)

	const updateTabData = (tabData: TabData) => {
		tabsState.setState(
			tabsState.state.value.map((e, index) =>
				indexState.state.value === index ? tabData : e,
			),
		)
	}

	const addTab = (tab?: TabData) => {
		selectionInTabs.value.push([])
		tabsState.setState([...tabsState.state.value, tab ?? createTab()])
		indexState.setState(tabsState.state.value.length - 1)
	}

	const removeTab = (index: number) => {
		selectionInTabs.value = selectionInTabs.value.filter(
			(_e, i) => index !== i,
		)
		tabsState.setState(tabsState.state.value.filter((_e, i) => index !== i))
		if (index >= tabsState.state.value.length)
			indexState.setState(tabsState.state.value.length - 1)
	}

	const moveToNext = () => {
		if (tabsState.state.value.length === 1) return
		if (indexState.state.value === tabsState.state.value.length - 1)
			indexState.setState(0)
		else indexState.setState(indexState.state.value + 1)
	}

	const moveToPrev = () => {
		if (tabsState.state.value.length === 1) return
		if (indexState.state.value === 0)
			indexState.setState(tabsState.state.value.length - 1)
		else indexState.setState(indexState.state.value - 1)
	}

	onInit(() => {
		eventHandler.subscribe<UpdateTabData>(UPDATE_TAB_DATA, (data) => {
			updateTabData({
				path: data.path,
				history: data.history,
			})
		})
		eventHandler.subscribe<UpdateTabSelection>(
			UPDATE_TAB_SELECTION,
			(data) => {
				selectionInTabs.value[indexState.state.value] = data.selection
			},
		)
	})

	return {
		moveToPrev,
		moveToNext,
		removeTab,
		addTab,
		updateTabData,
		index: indexState.state,
		tabs: tabsState.state,
		selectionInTabs,
	}
}
