export type Action = {
    label: string;
    actionType: string;
    api: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
};
