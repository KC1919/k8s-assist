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
    containers: [{
        name: string;
        image: string;
        ready: boolean;
        restartCount: number;
    }];
}

