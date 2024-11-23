import { OnInitJob } from '../../core/application/on-init-job/on-init-job.js'
import { GetNodeDetails } from '../services/node.details.js'
import { Node } from '../types/node.js'

export const nodeDetailLogic = (
	node: Node,
	onInitJob: OnInitJob,
	getNodeDetails: GetNodeDetails,
) => {
	const detailsJob = onInitJob(() => getNodeDetails(node))

	return {
		data: detailsJob.data,
		isLoading: detailsJob.isLoading,
		error: detailsJob.error,
	}
}
