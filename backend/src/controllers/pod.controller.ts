import { Request, Response } from "express";
import { Pod } from "../types/k8s.types";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/apiResponse";

/**
 * Pod controller handles CRUD operations and log retrieval for Kubernetes Pods.
 */
/**
 * Retrieve pods for the requested namespace and return a formatted pod list.
 */
export const listPods = async (
    req: Request,
    res: Response,
) => {
    const { podService } = (req as any).services;
    const { namespace } = req.query;

    if(!namespace){
        throw new AppError("Namespace is required", 400);
    }
    const pods = await podService.getPods(namespace);

    const formattedPods: Pod[] = pods.map((pod: any) => ({
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        status: pod.status.phase,
        nodeName: pod.spec.nodeName,
        containers: pod.spec.containers.map((container: any) => ({
            name: container.name,
            image: container.image,
            ready: container.ready,
            restartCount: container.restartCount,
        })),
    }));
    res.status(200).json(new ApiResponse(formattedPods, "Pods fetched successfully"));
};

/**
 * Fetch logs for a specific pod and optional container within a namespace.
 */
export const getPodLogs = async (
    req: Request,
    res: Response,
) => {
    const { podService } = (req as any).services;
    const { name: podName } = req.params;
    const namespace = (req.query.namespace as string) || "default";
    const container = req.query.container as string;

    if (!podName) {
        throw new AppError("Pod name is required", 400);
    }

    if (!namespace) {
        throw new AppError("Namespace is required", 400);
    }

    const podLogs = await podService.getPodLogs({
        podName,
        namespace,
        container,
    });

    res.status(200).json(new ApiResponse(podLogs, "Pod logs fetched successfully"));
};

/**
 * Return detailed metadata and status for a single pod.
 */
export const getPodDetails = async (
    req: Request,
    res: Response,
) => {
    const { podService } = (req as any).services;
    const { name } = req.params;
    const { namespace } = req.query;

    if (!name) {
        throw new AppError("Pod name is required", 400);
    }

    if (!namespace) {
        throw new AppError("Namespace is required", 400);
    }

    const podDetails = await podService.getPodDetails(name, namespace);

    const formattedPod: Pod = {
        name: podDetails.metadata?.name,
        namespace: podDetails.metadata?.namespace,
        nodeName: podDetails.spec?.nodeName,
        status: podDetails.status?.phase,
        labels: podDetails.metadata?.labels,
        containers: podDetails.spec?.containers.map((c: any) => c.name),
        restartCount: podDetails.status?.containerStatuses?.reduce(
            (acc: number, c: any) => acc + (c.restartCount || 0),
            0,
        ),
    };

    res.status(200).json(new ApiResponse(formattedPod, "Pod details fetched successfully"));
};

/**
 * Delete a pod by name from the specified namespace.
 */
export const deletePod = async (
    req: Request,
    res: Response,
) => {
    const { podService } = (req as any).services;
    const { name } = req.params;
    const { namespace } = req.query;

    if (!name) {
        throw new AppError("Pod name is required", 400);
    }

    if (!namespace) {
        throw new AppError("Namespace is required", 400);
    }

    const response = await podService.deletePod(name, namespace);

    res.status(204).json(new ApiResponse(null, response.message));
}
