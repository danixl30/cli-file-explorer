import { db } from '../../core/infraestructure/db/bookmark.db.js'
import { WriteBookMarks } from '../services/write.bookmarks.js'

export const saveBookmarks: WriteBookMarks = async (bookmarks) => {
	db.data.bookmarks = bookmarks
	await db.write()
}
