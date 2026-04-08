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

