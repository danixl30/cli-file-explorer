import { Node } from '../types/node.js'

export type FilterByGlobPattern = (nodes: Node[], pattern: string) => Node[]
