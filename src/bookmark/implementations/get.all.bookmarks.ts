import { db } from '../../core/infraestructure/db/bookmark.db.js'
import { GetAllBookmarks } from '../services/get.all.bookmarks.js'

export const getAllBookMarks: GetAllBookmarks = async () => db.data.bookmarks
