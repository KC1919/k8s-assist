import { Request, Response } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";
import { Event } from "../types/k8s.types";

export const listEvents = async (req: Request, res: Response) => {
    const { eventService } = (req as any).services;
    const { namespace, type } = req.query;

    const events = await eventService.listEvents(namespace as string, type as string);

    const formattedEvents: Event[] = events.map((event: any) => ({
        name: event.involvedObject.name,
        namespace: event.metadata.namespace,
        reason: event.reason,
        message: event.message,
        kind: event.involvedObject.kind,
        type: event.type,
        count: event.count,
        firstTimestamp: event.firstTimestamp,
        lastTimestamp: event.lastTimestamp,
    }));
    res.status(200).json(new ApiResponse(formattedEvents, "Events fetched successfully"));
};