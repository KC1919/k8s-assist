import { Request, Response, NextFunction } from "express";
import { Namespace } from "../types/k8s.types";
import { AppError } from "../utils/AppError";

export const listNamespaces = async (req: Request, res: Response, next: NextFunction) => {
    const { namespaceService } = (req as any).services;

    const namespaces = await namespaceService.getNamespaces();

    const formatted = namespaces.map((ns: Namespace) => ({
        name: ns.metadata?.name,
    }));

    res.json(formatted);
}

export const createNamespace = async (req: Request, res: Response, next: NextFunction) => {
    const { namespaceService } = (req as any).services;
    const { namespace } = req.query;

    if (!namespace) {
        throw new AppError("Namespace is required", 400);
    }

    const response = await namespaceService.createNamespace(namespace);

    res.json(response);
}