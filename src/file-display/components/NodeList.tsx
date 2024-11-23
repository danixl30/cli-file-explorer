import { Badge } from '@inkjs/ui'
import { Box, Text } from 'ink'
import React, { useEffect, useMemo, useState } from 'react'
import { useResize } from '../hooks/useResize.js'
import { Node } from '../types/node.js'
import { getNodeIcon } from '../utils/icon.parser.js'

const createRange = (start: number, end: number): number[] => {
	const arr: number[] = []
	for (let index = start; index <= end; index++) arr.push(index)
	return arr
}

const calculatePercent = (nodes: Node[], index: number) =>
	Math.round((index * 100) / nodes.length)

export const NodeList = (props: {
	nodes: Node[]
	selections: Node[]
	index: number
	isTabs: boolean
}) => {
	const { selections, nodes, index } = props
	const [lines, setLines] = useState(0)
	const [[top, down], setSubIndexes] = useState<[number, number]>([
		-1,
		lines - 2,
	])
	const [_columns, rows] = useResize()

	useEffect(() => {
		if (index === -1) {
			setSubIndexes([-1, lines - 2])
			return
		}
		if (index < top) {
			setSubIndexes([index, index + lines - 1])
			return
		}
		if (index > down) {
			setSubIndexes([index - lines + 1, index])
			return
		}
	}, [lines, props.index, nodes, top, down])

	useEffect(() => {
		const lines = rows - 6 - (props.isTabs ? 3 : 0)
		setLines(lines)
		setSubIndexes([-1, lines - 2])
	}, [rows, props.isTabs])
	const range = useMemo(() => createRange(top, down), [top, down])
	return (
		<>
			<Box flexDirection="column" height="100%">
				{top >= -1 && down <= lines - 2 && (
					<Text
						backgroundColor={
							props.index === -1 ? 'blue' : undefined
						}
					>
						..
					</Text>
				)}
				{props.nodes?.length > 0 &&
					range.map((e) => {
						if (e === -1) return <></>
						const file = props.nodes[e]
						if (!file) return <></>
						return (
							<>
								<Text
									backgroundColor={
										index === e ? 'blue' : undefined
									}
								>{`${
									selections.length > 0 &&
									selections.some((e) => e.path === file.path)
										? ' '
										: selections.length > 0 &&
												selections.some(
													(e) => e.path !== file.path,
												)
											? '󱗝 '
											: ''
								}${getNodeIcon(file)} ${file.name}`}</Text>
							</>
						)
					})}
			</Box>
			<Badge color="blueBright">
				{calculatePercent(nodes ?? [], index + 1) + '%'}
			</Badge>
		</>
	)
}
