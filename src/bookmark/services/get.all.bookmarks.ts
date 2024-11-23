import { BookmarkItem } from '../types/bookmark.js'

export type GetAllBookmarks = () => Promise<BookmarkItem[]>
