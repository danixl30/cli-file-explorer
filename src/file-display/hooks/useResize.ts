import { useStdout } from 'ink'
import { useEffect, useState } from 'react'

export const useResize = () => {
	const { stdout } = useStdout()
	const [size, setSize] = useState({
		columns: stdout.columns,
		rows: stdout.rows,
	})

	useEffect(() => {
		function onResize() {
			setSize({
				columns: process.stdout.columns,
				rows: process.stdout.rows,
			})
		}

		process.stdout.on('resize', onResize)
		process.stdout.write('\x1b[?1049h')
		return () => {
			process.stdout.off('resize', onResize)
			process.stdout.write('\x1b[?1049l')
		}
	}, [])

	return [size.columns, size.rows] as const
}
