import { existsSync } from 'node:fs'
import { db } from '../../core/infraestructure/db/bookmark.db.js'
import { CleanBookmarks } from '../services/clean.bookmarks.js'

export const cleanBookmarks: CleanBookmarks = async () => {
	db.data.bookmarks = db.data.bookmarks.filter((e) => existsSync(e.path))
	await db.write()
}
