import { Box, Text, useInput } from 'ink'
import React, { useContext, useState } from 'react'
import { EventContext } from '../core/infraestructure/event-handler/context/EventProvider.js'
import { nativeOnInitJob } from '../core/infraestructure/on-init-job/nativeOnInitJob.js'
import { useEffectOnInit } from '../core/infraestructure/on-init/useEffectOnInit.js'
import { useEffectStateObserver } from '../core/infraestructure/state-observer/useEffectStateObserver.js'
import { useRefStateFactory } from '../core/infraestructure/state/useRefStateProvider.js'
import { NODE_WRITTEN } from '../file-display/events/node.written.js'
import { Node } from '../file-display/types/node.js'
import { InputContextCapture } from '../input-capture/InputContextCapture.js'
import { TabsContext } from '../tabs/TabsContext.js'
import { TextFieldContextCapture } from '../text-field/TextFieldCaptureContext.js'
import { BookmarkList } from './components/BookmarkList.js'
import { BookmarkPaneContext } from './context/BookmarkPaneContext.js'
import { ADD_BOOKMARK_ITEM, AddBookmarkItem } from './events/add.item.js'
import { cleanBookmarks } from './implementations/clean.bookmarks.js'
import { getAllBookMarks } from './implementations/get.all.bookmarks.js'
import { saveBookmarks } from './implementations/save.bookmarks.js'
import { bookmarkManager } from './logic/bookmark.manager.js'

export const Bookmark = () => {
	const [index, setIndex] = useState(0)
	const eventHandler = useContext(EventContext)!
	const textField = useContext(TextFieldContextCapture)
	const inputController = useContext(InputContextCapture)
	const tabs = useContext(TabsContext)
	const bookmark = bookmarkManager(
		nativeOnInitJob(
			useRefStateFactory(),
			useEffectStateObserver,
			useEffectOnInit,
		),
		getAllBookMarks,
		saveBookmarks,
		cleanBookmarks,
	)
	const { isBookmarkEnabled, toggleBookmarkPane } =
		useContext(BookmarkPaneContext)
	const filesList = bookmark.data.value!
	const moveUpArrow = () => {
		setIndex((prev) => {
			if (prev <= 0) return prev
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
	const togglePane = () => {
		if (!isBookmarkEnabled) return toggleBookmarkPane()
		if (!filesList || !filesList.length) return
		return toggleBookmarkPane()
	}
	const selectOne = () => {
		const item = filesList[index]
		if (!item) return
		toggleBookmarkPane()
		tabs.addTab({
			path: item.path,
			history: {
				forward: [],
				previous: [],
			},
		})
	}
	const remove = () => {
		const item = filesList[index]
		if (!item) return
		bookmark.removeBookmark(item)
	}
	const addItem = (item: Node) => {
		textField.addCallback({
			placeHolder: 'Add alias',
			callback: {
				onChange: (data) => {
					const filesList = bookmark.data.value!
					if (filesList.some((e) => e.alias === data))
						textField.setError('Alias already exist')
					else textField.setError('')
				},
				onSuccess: async (data) => {
					if (!data) return
					bookmark.saveBookmark({
						alias: data,
						path: item.path,
					})
				},
			},
		})
	}
	useEffectOnInit(() => {
		eventHandler.subscribe<AddBookmarkItem>(ADD_BOOKMARK_ITEM, (data) => {
			addItem(data.item)
		})
		eventHandler.subscribe(NODE_WRITTEN, () => {
			bookmark.setCleanBookmarks()
		})
	})
	useInput((input, key) => {
		if (inputController.isInputEnabled || textField.isInputEnabled) return
		if (input === 's') togglePane()
		if (!isBookmarkEnabled) return
		if (key.downArrow) moveDownArrow()
		else if (key.upArrow) moveUpArrow()
		else if (key.return) selectOne()
		else if (input === 'd') remove()
	})
	if (!bookmark.data.value?.length) return <></>
	return (
		<>
			<Box
				height="100%"
				borderStyle="round"
				flexDirection="column"
				width="20%"
			>
				<Box borderStyle="double" width="100%">
					<Text>Bookmarks:</Text>
				</Box>
				<BookmarkList
					index={index}
					items={filesList}
					isEnabled={isBookmarkEnabled}
				/>
			</Box>
		</>
	)
}
