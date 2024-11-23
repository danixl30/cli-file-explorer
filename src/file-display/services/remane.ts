import { Node } from '../types/node.js'

export type RenameNode = (node: Node, newName: string) => Promise<void>
