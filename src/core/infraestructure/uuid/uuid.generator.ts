import { randomUUID } from 'node:crypto'
import { IDGenerator } from '../../application/id-generator/id.generator.js'

export const uuidGenerator: IDGenerator<string> = () => randomUUID()
