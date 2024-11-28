import { randomUUID } from 'node:crypto'
import { Badge } from '@inkjs/ui'
import { Box, Text } from 'ink'
import React, { useEffect, useMemo, useState } from 'react'
import { useResize } from '../../file-display/hooks/useResize.js'
import { BookmarkItem } from '../types/bookmark.js'

const createRange = (start: number, end: number): number[] => {
	const arr: number[] = []
	for (let index = start; index <= end; index++) arr.push(index)
	return arr
}

const calculatePercent = (nodes: BookmarkItem[], index: number) =>
	Math.round((index * 100) / nodes.length)

export const BookmarkList = (props: {
	items: BookmarkItem[]
	index: number
	isEnabled: boolean
}) => {
	const { items, index, isEnabled } = props
	const [lines, setLines] = useState(0)
	const [[top, down], setSubIndexes] = useState<[number, number]>([
		0,
		lines - 1,
	])
	const [_columns, rows] = useResize()

	useEffect(() => {
		if (index < top) {
			setSubIndexes([index, index + lines - 1])
			return
		}
		if (index > down) {
			setSubIndexes([index - lines + 1, index])
			return
		}
	}, [lines, props.index, items, top, down])

	useEffect(() => {
		const lines = rows - 6
		setLines(lines)
		setSubIndexes([0, lines - 1])
	}, [rows])
	const range = useMemo(() => createRange(top, down), [top, down])
	return (
		<>
			<Box height="100%" flexDirection="column">
				{items.length &&
					range.map((e) => {
						const item = items[e]
						if (!item) return <></>
						return (
							<Text
								key={randomUUID()}
								backgroundColor={
									index === e && isEnabled
										? 'blue'
										: undefined
								}
							>
								{' ' + item.alias}
							</Text>
						)
					})}
			</Box>
			<Badge color="blueBright">
				{calculatePercent(items, index + 1) + '%'}
			</Badge>
		</>
	)
}
