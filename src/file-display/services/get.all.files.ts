import { Node } from '../types/node.js'

export type GetAllFile = (path: string) => Promise<Node[]>
