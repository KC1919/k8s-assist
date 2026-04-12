import { EventService } from "./event.service";
import { Insight } from "../types/k8s.types";
import { RuleEngine } from "../rules/rule.engine";
import { AppError } from "../utils/AppError";

/**
 * InsightService composes event retrieval and rule analysis to generate insights.
 */
export class InsightService {

    constructor(){}

    eventService = new EventService();
    ruleEngine = new RuleEngine();

    /**
     * Generate a list of insights based on event analysis for the requested namespace.
     */
    async generateInsights(namespace?:string): Promise<Insight[]> {

        const events = await this.eventService.listEvents(namespace);
        const analysis = this.ruleEngine.analyzeEvent(events);

        if(!analysis){
            throw new AppError(`Failed to generate insights for ${namespace}`, 500);
        }

        return analysis;
    }
}