interface formattedPod {
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

export type { formattedPod };