import React, { createContext, ReactNode, useState } from 'react'

export const BookmarkPaneContext = createContext<{
	isBookmarkEnabled: boolean
	toggleBookmarkPane(): void
}>(undefined as unknown as any)

type BookmarkPaneContextProviderProps = {
	children: ReactNode | ReactNode[]
}

export const BookmarkPaneContextProvider = (
	props: BookmarkPaneContextProviderProps,
) => {
	const [isBookmarkEnabled, setIsBookmarkEnabled] = useState(false)

	const toggleBookmarkPane = () => {
		setIsBookmarkEnabled((prev) => !prev)
	}

	return (
		<BookmarkPaneContext.Provider
			value={{ isBookmarkEnabled, toggleBookmarkPane }}
		>
			{props.children}
		</BookmarkPaneContext.Provider>
	)
}
