import { Box } from 'ink'
import React from 'react'
import { AlertContextProvider } from './alerts/AlertContextProvider.js'
import { AlertDisplay } from './alerts/components/AlertDisplay.js'
import { BookmarkPaneContextProvider } from './bookmark/context/BookmarkPaneContext.js'
import { ClipboardProvider } from './clipboard/ClipboardProvider.js'
import { EventProvider } from './core/infraestructure/event-handler/context/EventProvider.js'
import { InputCaptureWarpper } from './input-capture/InputCapureWrapper.js'
import { InputContextCaptureProvider } from './input-capture/InputContextCapture.js'
import { TabsContextProvider } from './tabs/TabsContext.js'
import TabsWrapper from './tabs/wrapper/tabs.wrapper.js'
import { TextFieldContextCaptureProvider } from './text-field/TextFieldCaptureContext.js'
import { TextFieldWrapper } from './text-field/TextFieldWrapper.js'

export default function App(props: {
	defaultPath: string
}) {
	return (
		<Box height="100%" width="100%" flexDirection="column">
			<EventProvider>
				<TextFieldContextCaptureProvider>
					<InputContextCaptureProvider>
						<AlertContextProvider>
							<ClipboardProvider>
								<BookmarkPaneContextProvider>
									<TabsContextProvider defaultPath={props.defaultPath}>
										<TabsWrapper />
										<AlertDisplay />
										<InputCaptureWarpper />
										<TextFieldWrapper />
									</TabsContextProvider>
								</BookmarkPaneContextProvider>
							</ClipboardProvider>
						</AlertContextProvider>
					</InputContextCaptureProvider>
				</TextFieldContextCaptureProvider>
			</EventProvider>
		</Box>
	)
}
