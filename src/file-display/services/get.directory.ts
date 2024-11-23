import { Node } from '../types/node.js'

export type GetNextDirectory = (node: Node) => Promise<string>
