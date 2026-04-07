import { Request, Response, NextFunction } from "express";
import { Pod } from "../types/k8s.types";


export const listPods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { podService } = (req as any).services;
        const pods = await podService.getPods(req.query.namespace as string);

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
        res.json(formattedPods);
    } catch (error) {
        next(error);
    }
};

export const getPodLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { podService } = (req as any).services;
        const { name: podName } = req.params;
        const namespace = req.query.namespace as string || "default";
        const container = req.query.container as string;

        if (!podName) {
            return res.status(400).json({
                message: "Pod name is required",
            });
        }

        if (!namespace) {
            return res.status(400).json({
                message: "Namespace is required",
            });
        }

        const podLogs = await podService.getPodLogs({podName, namespace, container});

        res.send(podLogs);
    } catch (error) {
        next(error);
    }
}
