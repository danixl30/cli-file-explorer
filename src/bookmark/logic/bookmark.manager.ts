import { OnInitJob } from '../../core/application/on-init-job/on-init-job.js'
import { CleanBookmarks } from '../services/clean.bookmarks.js'
import { GetAllBookmarks } from '../services/get.all.bookmarks.js'
import { WriteBookMarks } from '../services/write.bookmarks.js'
import { BookmarkItem } from '../types/bookmark.js'

export const bookmarkManager = (
	onInitJob: OnInitJob,
	getAllBookmarks: GetAllBookmarks,
	saveBookMarks: WriteBookMarks,
	cleanBookmarks: CleanBookmarks,
) => {
	const bookmarksJob = onInitJob(getAllBookmarks)

	const saveBookmark = async (item: BookmarkItem) => {
		if (bookmarksJob.data.value?.some((e) => e.alias === item.alias))
			throw new Error('Alias already exist')
		await saveBookMarks([...bookmarksJob.data.value!, item])
		bookmarksJob.reload()
	}
	const removeBookmark = async (item: BookmarkItem) => {
		await saveBookMarks(
			bookmarksJob.data.value!.filter((e) => e.alias !== item.alias),
		)
		bookmarksJob.reload()
	}
	const setCleanBookmarks = async () => {
		await cleanBookmarks()
		bookmarksJob.reload()
	}

	return {
		data: bookmarksJob.data,
		isLoading: bookmarksJob.isLoading,
		error: bookmarksJob.error,
		saveBookmark,
		removeBookmark,
		setCleanBookmarks,
	}
}
