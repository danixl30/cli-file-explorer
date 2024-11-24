import { join } from 'node:path'
import { Low } from 'lowdb'
import { JSONFilePreset } from 'lowdb/node'

type BookMark = {
	alias: string
	path: string
}

type Data = {
	bookmarks: BookMark[]
}

export const db: Low<Data> = await JSONFilePreset<Data>(
	join(import.meta.dirname, '../../../../db.json'),
	{
		bookmarks: [],
	},
)
