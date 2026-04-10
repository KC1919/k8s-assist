import  { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';

export const listDeployments = async (req: Request, res: Response) => {
    const { deploymentService } = (req as any).services;
    const { namespace } = req.query;
    const deployments = await deploymentService.listDeployments(namespace);

    const formattedDeployments = deployments.map((d: any) => ({
        name: d.metadata?.name,
        namespace: d.metadata.namespace,
        replicas: d.spec.replicas,
        availableReplicas: d.status?.availableReplicas,
        readyReplicas: d.status?.readyReplicas,
        updatedReplicas: d.status?.updatedReplicas,
    }));

    res.json(new ApiResponse(formattedDeployments, 'Deployments fetched successfully'));
} 