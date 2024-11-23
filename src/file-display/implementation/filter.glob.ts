import { minimatch } from 'minimatch'
import { FilterByGlobPattern } from '../services/filter.glob.js'

export const filterByGlobPattern: FilterByGlobPattern = (nodes, pattern) =>
	nodes.filter((e) =>
		minimatch(e.path, pattern, {
			matchBase: true,
		}),
	)
