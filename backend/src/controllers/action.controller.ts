import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

/**
 * Action controller executes predefined actions based on insights and returns results.
 */
export const executeAction = async (req: Request, res: Response) => {
    const { actionService } = (req as any).services;
    const { actionType, payload } = req.body;

    if (!actionType) {
        throw new AppError("Action type is required", 400);
    }

    const result = await actionService.executeAction(actionType, payload);

    return res.status(200).json(new ApiResponse(result, "Action executed successfully"));
}