import { Action } from "../types/action.types";

export class ActionFactory {
    static viewLogs(pod: string, namespace: string): Action {
        return {
            label: "View Logs",
            actionType: "VIEW_LOGS",
            api: `${process.env.API_BASE_URL}/api/pods/${pod}/logs?namespace=${namespace}`,
            method: "GET"
        }
    }

    static viewPodDetails(pod: string, namespace: string): Action {
        return {
            label: "View Pod Details",
            actionType: "VIEW_POD_DETAILS",
            api: `${process.env.API_BASE_URL}/api/pods/${pod}?namespace=${namespace}`,
            method: "GET"
        }
    }

    static restartDeployment(deploymentName: string, namespace: string): Action {
        return {
            label: "Restart Deployment",
            actionType: "RESTART_DEPLOYMENT",
            api: `${process.env.API_BASE_URL}/api/deployments/${deploymentName}/restart?namespace=${namespace}`,
            method: "PATCH"
        }
    }

    static deletePod(pod: string, namespace: string): Action {
        return {
            label: "Delete Pod",
            actionType: "DELETE_POD",
            api: `${process.env.API_BASE_URL}/api/pods/${pod}?namespace=${namespace}`,
            method: "DELETE"
        }
    }

    static viewRelatedEvents(pod: string, namespace: string): Action {
        return {
            label: "View Related Events",
            actionType: "VIEW_EVENTS",
            api: `${process.env.API_BASE_URL}/api/events?namespace=${namespace}&type=Warning`,
            method: "GET"
        }
    }

    static scaleDeployment(deployment: string, namespace: string, replicas: Number): Action {
        return {
            label: "View Related Events",
            actionType: "VIEW_EVENTS",
            api: `${process.env.API_BASE_URL}/api/deployments/{deploymentName}/scale?namespace=${namespace}&replicas=${replicas}`,
            method: "GET"
        }
    }

    static buildRuleActions(pod: string, namespace: string, options?: { 
            logs?: boolean; 
            podDetails?: boolean; 
            events?: boolean; 
            deletePod?: boolean;
            restartDeployment?: boolean
        }) {
        
            if (!pod || !namespace) {
            return [];
        }

        const actions: Action[] = [];

        if (options?.logs) {
            actions.push(this.viewLogs(pod,namespace));
        }

        if (options?.podDetails) {
            actions.push(this.viewPodDetails(pod,namespace));
        }

        if (options?.events) {
            actions.push(this.viewRelatedEvents(pod,namespace));
        }

        if (options?.deletePod) {
            actions.push(this.deletePod(pod,namespace));
        }

        return actions;
    }
}

