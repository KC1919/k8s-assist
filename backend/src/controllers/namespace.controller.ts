import { Request, Response, NextFunction } from "express";
import { Namespace } from "../types/k8s.types";
import { AppError } from "../utils/AppError";
import { ApiResponse } from "../utils/apiResponse";

/**
 * Namespace controller handles listing and creation of Kubernetes namespaces.
 */
/**
 * Return all available Kubernetes namespaces.
 */
export const listNamespaces = async (req: Request, res: Response, next: NextFunction) => {
    const { namespaceService } = (req as any).services;

    const namespaces = await namespaceService.getNamespaces();

    const formatted = namespaces.map((ns: Namespace) => ({
        name: ns.metadata?.name,
    }));

    res.status(200).json(new ApiResponse(formatted, "Namespaces fetched successfully"));
}

/**
 * Create a new Kubernetes namespace if the provided name does not already exist.
 */
export const createNamespace = async (req: Request, res: Response, next: NextFunction) => {
    const { namespaceService } = (req as any).services;
    const { namespace } = req.query;

    if (!namespace) {
        throw new AppError("Namespace is required", 400);
    }

    const response = await namespaceService.createNamespace(namespace);

    res.status(201).json(new ApiResponse(response, "Namespace created successfully"));
}