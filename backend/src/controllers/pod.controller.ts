import { Request, Response } from "express";

export const listPods = async (req: Request, res: Response) => {
    try {
        const { podService } = (req as any).services;
        const pods = await podService.getPods(req.query.namespace as string);
        res.json(pods);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch pods" });
    }
};
