import { NodeDetails } from '../types/node.details.js'
import { Node } from '../types/node.js'

export type GetNodeDetails = (node: Node) => Promise<NodeDetails>
