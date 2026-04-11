import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

export const getInsights = async (req: Request, res: Response) => {
    const { insightService } = (req as any).services;
    const namespace = req.query.namespace as string;

    if (!namespace) {
        throw new AppError("Namespace is required", 400);
    }

    const insights = await insightService.generateInsights(namespace);

    if(insights.length === 0){
        return res.status(200).json(new ApiResponse([], 'No issues detected in the given namespace'));
    }

    res.status(200).json(new ApiResponse(insights, 'Insights fetched successfully'));
} 