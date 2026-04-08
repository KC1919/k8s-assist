import { WebSocketServer } from "ws";
import * as k8s from "@kubernetes/client-node";

export function setupLogSocket(server: any) {
  const wss = new WebSocketServer({ 
    server, 
  });

  wss.on("connection", (ws, req) => {
    console.log("Client connected for logs");

    ws.on("message", async (message) => {
      try {
        const { podName, namespace } = JSON.parse(message.toString());

        const kc = new k8s.KubeConfig();
        kc.loadFromDefault();

        const log = new k8s.Log(kc);

        const stream = new (require("stream").PassThrough)();

        stream.on("data", (chunk: Buffer) => {
          ws.send(chunk.toString());
        });

        await log.log(
          namespace,
          podName,
          "", // container (optional)
          stream,
          {
            follow: true, // REAL-TIME
            pretty: false,
            timestamps: false,
          }
        );
      } catch (err) {
        console.error("Log stream error:", err);
        ws.send("Error streaming logs");
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}