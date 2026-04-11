import { Insight, Rule } from "../types/k8s.types";

export class RuleEngine {

    private rules: Rule[] = [];

    constructor() {
        this.rules = [
            {
                reason: "CrashLoopBackOff",
                message: "Pod is in CrashLoopBackOff state, which means it is repeatedly crashing. Check the pod logs for more details.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod is crashing repeatedly",
                    reason: event.reason,
                    suggestion: "Check the pod logs to identify the root cause of the crashes. Common issues include application errors, insufficient resources, or misconfigurations.",
                    severity: "High"
                })
            },
            {
                reason: "ImagePullBackOff",
                message: "Pod is in ImagePullBackOff state, which means it is unable to pull the container image. Check the image name and registry credentials.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod cannot pull container image",
                    reason: event.reason,
                    suggestion: "Verify that the image name is correct and that the registry credentials are properly configured. Also, check if the image exists in the registry.",
                    severity: "Medium"
                })
             },
             {
                reason: "FailedScheduling",
                message: "Pod is in FailedScheduling state, which means it cannot be scheduled on any node. Check the cluster resources and node conditions.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod cannot be scheduled",
                    reason: event.reason,
                    suggestion: "Check the cluster resources and node conditions to ensure there are enough resources available for the pod. Also, check for any taints or tolerations that may be affecting scheduling.",
                    severity: "Medium"
                })
             },
             {
                reason: "OOMKilled",
                message: "Pod was killed due to Out of Memory (OOM) error. Check the pod resource limits and usage.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod was killed due to OOM error",
                    reason: event.reason,
                    suggestion: "Review the pod's resource limits and usage to ensure that it has enough memory allocated. Consider increasing the memory limits or optimizing the application to reduce memory usage.",
                    severity: "High"
                })
             },
             {
                reason: "NodeNotReady",
                message: "Pod is scheduled on a node that is not ready. Check the node status and conditions.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod is on a node that is not ready",
                    reason: event.reason,
                    suggestion: "Check the status and conditions of the node where the pod is scheduled. Ensure that the node is healthy and has network connectivity.",
                    severity: "Medium"
                })
             },
             {
                reason: "BackOff",
                message: "Pod is in BackOff state, which means it is being restarted repeatedly. Check the pod logs for more details.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod is being restarted repeatedly",
                    reason: event.reason,
                    suggestion: "Check the pod logs to identify the root cause of the restarts. Common issues include application errors, insufficient resources, or misconfigurations.",
                    severity: "High"
                })
             },
             {
                reason: "ErrImagePull",
                message: "Pod is in ErrImagePull state, which means it encountered an error while trying to pull the container image. Check the image name and registry credentials.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod encountered an error while pulling container image",
                    reason: event.reason,
                    suggestion: "Verify that the image name is correct and that the registry credentials are properly configured. Also, check if the image exists in the registry.",
                    severity: "Medium"
                })
             },
             {
                reason: "Evicted",
                message: "Pod was evicted from its node due to resource constraints. Check the cluster resources and node conditions.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod was evicted due to resource constraints",
                    reason: event.reason,
                    suggestion: "Check the cluster resources and node conditions to ensure there are enough resources available for the pod. Consider optimizing resource usage or scaling the cluster if necessary.",
                    severity: "Medium"
                })
             },
             {
                reason: "Unhealthy",
                message: "Pod is marked as Unhealthy, which means it is not responding to health checks. Check the pod's health check configuration and logs.",
                type: "Warning",
                handler: (event: any) => ({
                    issue: "Pod is not responding to health checks",
                    reason: event.reason,
                    suggestion: "Review the pod's health check configuration and logs to identify any issues. Ensure that the application is healthy and responsive.",
                    severity: "High"
                })
             }
        ];
    }

    anaylyzeEvent(events: any): Insight[] {

        const insights: Insight[] = [];

        for(const event of events){
            const rule = this.rules.find(r => r.reason === event.reason);
            if(rule){
                const insight = rule.handler(event);
                if(insight){
                    insights.push({
                        ...insight,
                        pod: event.name,
                        namespace: event.namespace,
                        timestamp: event.lastTimestamp,
                    } as any);
                }
            }
        }
        return insights;
    }
}