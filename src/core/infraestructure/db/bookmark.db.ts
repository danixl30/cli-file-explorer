import { Low } from 'lowdb'
import { JSONFilePreset } from 'lowdb/node'

type BookMark = {
	alias: string
	path: string
}

type Data = {
	bookmarks: BookMark[]
}

export const db: Low<Data> = await JSONFilePreset<Data>('db.json', {
	bookmarks: [],
})
