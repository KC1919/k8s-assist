import { Request, Response, NextFunction } from "express";
import { Namespace } from "../types/k8s.types";

export const listNamespaces = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { namespaceService } = (req as any).services;
        
        const namespaces = await namespaceService.getNamespaces();
        
        const formatted = namespaces.map((ns: Namespace) => ({
            name: ns.metadata?.name,
        }));

        res.json(formatted);
    } catch (error) {
        console.log("Failed to list namespaces", error);
        next(error);
        // res.status(500).json({message: "Failed to list namespaces", error: error});
    }
}

export const createNamespace = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {namespaceService} = (req as any).services;
        const { namespace } = req.query;

        const response = await namespaceService.createNamespace(namespace);

        res.json(response);
    } catch (error) {
        next(error);
    }
}