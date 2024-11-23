import { Node } from '../types/node.js'

export type ExecuteFile = (node: Node) => Promise<void>
