import { Request, Response, NextFunction } from "express";
import { formattedPod } from "../types/pod.types";


export const listPods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { podService } = (req as any).services;
        const pods = await podService.getPods(req.query.namespace as string);

        const formattedPods: formattedPod[] = pods.map((pod: any) => ({
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
