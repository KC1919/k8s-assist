import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { Deployment } from '../types/k8s.types';

/**
 * Deployment controllers handle deployment listing, scaling, restart, and deletion.
 */
/**
 * Return all deployments for the provided namespace, or all namespaces if none is supplied.
 */
export const listDeployments = async (req: Request, res: Response) => {
    const { deploymentService } = (req as any).services;
    const { namespace } = req.query;
    const deployments = await deploymentService.listDeployments(namespace);

    const formattedDeployments: Deployment[] = deployments.map((d: any) => ({
        name: d.metadata?.name,
        namespace: d.metadata.namespace,
        replicas: d.spec.replicas,
        availableReplicas: d.status?.availableReplicas,
        readyReplicas: d.status?.readyReplicas,
        updatedReplicas: d.status?.updatedReplicas,
    }));

    res.status(200).json(new ApiResponse(formattedDeployments, 'Deployments fetched successfully'));
}

/**
 * Return detailed information for a specific deployment within the requested namespace.
 */
export const getDeploymentDetails = async (req: Request, res: Response) => {
    const { deploymentService } = (req as any).services;
    const { name } = req.params;
    const { namespace } = req.query;

    if (!namespace) {
        return res.status(400).json(new ApiResponse(null, 'Namespace query parameter is required'));
    }

    const deploymentDetails = await deploymentService.getDeploymentDetails(name, namespace);

    res.status(200).json(new ApiResponse(deploymentDetails, 'Deployment details fetched successfully'));
}

/**
 * Delete the specified deployment from a namespace and return a 204 response.
 */
export const deleteDeployment = async (req: Request, res: Response) => {
    const { deploymentService } = (req as any).services;
    const { name } = req.params;
    const { namespace } = req.query;

    if (!namespace) {
        return res.status(400).json(new ApiResponse(null, 'Namespace query parameter is required'));
    }

    await deploymentService.deleteDeployment(name, namespace);
    res.status(204).json(new ApiResponse(null, 'Deployment deleted successfully'));
}

/**
 * Scale a deployment horizontally by updating its replica count.
 */
export const scaleDeployment = async (req: Request, res: Response) => {
    const { deploymentService } = (req as any).services;
    const name = req.params.name as string;
    const namespace = req.query.namespace as string;
    const replicas = Number(req.query.replicas);

    if (!namespace) {
        return res.status(400).json(new ApiResponse(null, 'Namespace query parameter is required'));
    }

    if (replicas === undefined) {
        return res.status(400).json(new ApiResponse(null, 'Replicas field is required in request body'));
    }

    const result = await deploymentService.scaleDeployment(name, namespace, replicas);

    const respObj = {
        name: result.metadata?.name,
        namespace: result.metadata?.namespace,
        replicas: result.spec?.replicas
    }

    res.status(203).json(new ApiResponse(respObj, 'Deployment scaled successfully'));
}

/**
 * Restart a deployment by updating its pod template annotation to trigger a rolling update.
 */
export const restartDeployment = async (req: Request, res: Response) => {
    const { deploymentService } = (req as any).services;
    const name = req.params.name as string;
    const namespace = req.query.namespace as string;

    if (!namespace) {
        return res.status(400).json(new ApiResponse(null, 'Namespace query parameter is required'));
    }

    await deploymentService.restartDeployment(name, namespace);

    res.status(203).json(new ApiResponse(null, 'Deployment restarted successfully'));
}