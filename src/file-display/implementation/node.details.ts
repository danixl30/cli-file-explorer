import { Dirent, statSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { list } from 'drivelist'
import { getDiskInfoSync } from 'node-disk-info'
import { MutableRefObject, useEffect, useRef } from 'react'
import { GetNodeDetails } from '../services/node.details.js'

const dirSize = (isMounted: MutableRefObject<boolean>) => {
	const calculate = async (dir: string) => {
		if (!isMounted.current) throw new Error()
		const files = await readdir(dir, { withFileTypes: true })

		const paths = files.map(async (file: Dirent): Promise<number> => {
			const path = join(dir, file.name)

			if (file.isDirectory()) return calculate(path)

			if (file.isFile()) {
				if (!isMounted.current) throw new Error()
				const { size } = await stat(path)

				return size
			}

			return 0
		})

		return (await Promise.all(paths))
			.flat()
			.reduce((acc, size) => acc + size, 0) as number
	}

	return calculate
}

export const getNodeDetails = (): GetNodeDetails => {
	const isMounted = useRef(true)
	useEffect(() => {
		isMounted.current = true
		return () => {
			isMounted.current = false
		}
	}, [])
	return async (node) => {
		if (node.type === 'DRIVE') {
			const drives = await list()
			const infos = getDiskInfoSync()
			const disk = drives.find((e) =>
				e.mountpoints.some(
					(e) => e.path.replaceAll('\\', '/') === node.path,
				),
			)
			if (!disk) throw new Error('Disk not exist')
			const info = infos.find((e) => node.path.startsWith(e.mounted))
			if (!info) throw new Error('Not disk info')
			return {
				...node,
				size: disk.size ?? info.blocks,
				additionalData: {
					used: info.used,
					percent: info.capacity,
					fileSystem: info.filesystem,
					available: info.available,
					partitionSchema:
						disk.partitionTableType?.toUpperCase() ?? 'No schema',
					deviceType: disk.isCard
						? 'CARD'
						: disk.isUSB
							? 'USB'
							: disk.isSCSI
								? 'SCSI'
								: disk.isVirtual
									? 'VIRTUAL'
									: 'REMOVABLE',
				},
			}
		}
		const stats = statSync(node.path)
		return {
			...node,
			size:
				node.type === 'FILE'
					? stats.size
					: await dirSize(isMounted)(node.path),
			createdDate: stats.birthtime,
			lastModifiedDate: stats.mtime,
		}
	}
}
