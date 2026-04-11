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

