import { ClipboardItem } from '../../clipboard/logic/clipboard-logic.js'

export type PasteOperation = (
	data: ClipboardItem,
	destinate: string,
	replace: boolean,
) => Promise<void>
