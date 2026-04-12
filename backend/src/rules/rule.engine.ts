import { Insight, Rule } from "../types/k8s.types";

export class RuleEngine {

    private rules: Rule[] = [];

    private severityScore: Record<Insight['severity'], number> = {
        'Low': 1,
        'Medium': 2,
        'High': 3
    };

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
                    severity: "High",
                    actions: [
                        {
                            label: "View Logs",
                            actionType: "VIEW_LOGS",
                            api: `/api/pods/${event?.involvedObject?.name}/logs?namespace=${event.metadata.namespace}`,
                            method: "GET"
                        },
                        {
                            label: "Restart Deployment",
                            actionType: "RESTART_DEPLOYMENT",
                            api: `/api/deployments/${event?.involvedObject?.name}/restart?namespace=${event.metadata.namespace}`,
                            method: "POST"
                        }
                    ]
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
                    severity: "Medium",
                    actions: [
                        {
                            label: "View Logs",
                            actionType: "VIEW_LOGS",
                            api: `/api/pods/${event.name}/logs?namespace=${event.namespace}`,
                            method: "GET"
                        },
                        {
                            label: "Check Pod Details",
                            actionType: "CHECK_POD_DETAILS",
                            api: `/api/pods/${event.name}?namespace=${event.namespace}`,
                            method: "GET"
                        }
                    ]
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
                    severity: "High",
                    actions: [
                        {
                            label: "View Logs",
                            actionType: "VIEW_LOGS",
                            api: `http://localhost:5050/api/pods/${event?.involvedObject?.name}/logs?namespace=${event.metadata.namespace}`,
                            method: "GET"
                        },
                        {
                            label: "Check Pod Details",
                            actionType: "CHECK_POD_DETAILS",
                            api: `http://localhost:5050/api/pods/${event?.involvedObject?.name}?namespace=${event.metadata.namespace}`,
                            method: "GET"
                        }
                    ]
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

    analyzeEvent(events: any): Insight[] {

        const groupedInsights: Record<string, any> = {};

        // iterate over all the events of a namespace and apply the rules to generate insights
        for (const event of events) {
            // find the rule that matches the event reason
            const rule = this.rules.find(r => r.reason === event.reason);

            // if no rule matches, skip the event
            if (!rule) {
                continue;
            }

            // apply the rule handler to the event to generate an insight
            const baseInsight = rule.handler(event);

            // group insights by pod and namespace, and aggregate issues for the same pod
            if (baseInsight) {
                const pod = event.involvedObject?.name || event.name;
                const namespace = event.namespace || event.metadata?.namespace;
                const timestamp = event.lastTimestamp || event.metadata?.lastTimestamp || event.eventTime || event.reportingComponent;

                // use a combination of namespace and pod name as the key for grouping insights
                const podKey = `${namespace}/${pod}`;

                // if this is the first insight for the pod, initialize the group for the pod and namespace using podKey
                if(!groupedInsights[podKey]){
                    groupedInsights[podKey] = {
                        pod,
                        namespace,
                        issues: [],
                        timestamp
                    }
                }
                
                // check if the same issue already exists for the pod, if yes, increment the count, otherwise add a new issue to the list of issues for the pod
                const existingIssue = groupedInsights[podKey].issues.some((i:any) => i.reason === baseInsight.reason);

                if(!existingIssue){
                    groupedInsights[podKey].issues.push({...baseInsight, count:1});
                }
                else{
                    existingIssue.count++;
                }
            }
        }
        // sort the insights for each pod by severity and then return the list of insights grouped by pod and namespace
        return Object.values(groupedInsights).map(group => {
            group.issues.sort((a: Insight, b: Insight) => this.severityScore[b.severity] - this.severityScore[a.severity]);
            return {
                ...group,
                summary: this.buildSummary(group.issues),
                confidence: this.calculateConfidence(group.issues)
            };
        });
    }

    buildSummary(issues: any) {
        const totalIssues = issues.length;
        const highSeverity = issues.filter((i: any) => i.severity === 'High').length;
        const mediumSeverity = issues.filter((i: any) => i.severity === 'Medium').length;
        const lowSeverity = issues.filter((i: any) => i.severity === 'Low').length;

        return `Total Issues Detected: ${totalIssues}, (High: ${highSeverity}, Medium: ${mediumSeverity}, Low: ${lowSeverity})`;
    } 

    calculateConfidence(issues: any) {
        let score = 0;
        issues.forEach((issue: any) => {
            if(issue.severity === 'High') score += 0.5;
            else if(issue.severity === 'Medium') score += 0.3;
            else if(issue.severity === 'Low') score += 0.1;
        });
        return Math.min(1, score); // max confidence score is 1
    }
}