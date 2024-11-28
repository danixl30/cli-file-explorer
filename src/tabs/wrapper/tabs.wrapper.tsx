import { Box, Text, useInput } from 'ink'
import React, { useContext, useEffect, useState } from 'react'
import { Bookmark } from '../../bookmark/Bookmark.js'
import FileDisplay from '../../file-display/FileDisplay.js'
import { InputContextCapture } from '../../input-capture/InputContextCapture.js'
import { TextFieldContextCapture } from '../../text-field/TextFieldCaptureContext.js'
import { TabsContext } from '../TabsContext.js'

export default function TabsWrapper() {
	const tabs = useContext(TabsContext)
	const inputCapture = useContext(InputContextCapture)
	const textField = useContext(TextFieldContextCapture)
	const [childKey, setChildKey] = useState(0)

	useInput((input, key) => {
		if (inputCapture.isInputEnabled || textField.isInputEnabled) return
		if (key.tab && key.shift) tabs.moveToPrev()
		if (key.tab) tabs.moveToNext()
		if (input === 't' && key.ctrl) tabs.addTab()
		if (input === 'w' && key.ctrl) tabs.removeTab(tabs.index.value)
	})

	useEffect(() => {
		setChildKey((prev) => ++prev)
	}, [tabs.tabs.value, tabs.index.value])

	return (
		<>
			<Box flexDirection="row">
				<Bookmark />
				<Box height="100%" flexDirection="column">
					{tabs.tabs.value.length > 1 && (
						<Box width="100%" flexDirection="row">
							{tabs.tabs.value.map((_e, index) => (
								<Box
									borderStyle="round"
									borderColor={
										index === tabs.index.value
											? 'blue'
											: 'white'
									}
								>
									<Text>{`Tab: ${index + 1}`}</Text>
								</Box>
							))}
						</Box>
					)}
					{tabs.index.value < tabs.tabs.value.length &&
						tabs.index.value !== -1 && (
							<FileDisplay
								selection={
									tabs.selectionInTabs.value[
										tabs.index.value
									] ?? []
								}
								key={childKey}
								initialData={tabs.tabs.value[tabs.index.value]!}
							/>
						)}
				</Box>
			</Box>
		</>
	)
}
