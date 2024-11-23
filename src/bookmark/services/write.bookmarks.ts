import { BookmarkItem } from '../types/bookmark.js'

export type WriteBookMarks = (bookmarks: BookmarkItem[]) => Promise<void>
