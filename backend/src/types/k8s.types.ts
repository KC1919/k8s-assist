export interface Namespace {
    metadata: {
        name: string
    }
}

export interface Pod {
    name: string;
    namespace: string;
    status: string;
    nodeName: string;
    labels?: {},
    restartCount?: number
    containers: [{
        name: string;
        image: string;
        ready: boolean;
        restartCount: number;
    }];
}

export interface Deployment {
    name: string;
    namespace: string;
    replicas: number;
    availableReplicas?: number;
    readyReplicas?: number;
    updatedReplicas?: number;
}

export interface Event {
    name: string;
    namespace: string;
    reason: string;
    message: string;
    type: string;
    count: number;
    firstTimestamp: string;
    lastTimestamp: string;
}

export type Insight = {
    issue: string;
    reason: string;
    suggestion: string;
    severity: 'Low' | 'Medium' | 'High';
}

export type Rule = {
    reason: string;
    message: string;
    type: string;
    handler: (event: any) => Insight | null;
}