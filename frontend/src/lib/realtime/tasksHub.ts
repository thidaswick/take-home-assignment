import * as signalR from "@microsoft/signalr";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function hubBaseUrl(): string {
  const api = import.meta.env.VITE_API_URL || "http://localhost:5108/api";
  return api.replace(/\/api\/?$/, "");
}

export function startTaskRealtime(getToken: () => string | null, queryClient: QueryClient) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${hubBaseUrl()}/hubs/tasks`, {
      accessTokenFactory: () => getToken() ?? "",
    })
    .withAutomaticReconnect()
    .build();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  connection.on("TaskCreated", () => {
    invalidate();
    toast.message("Task created", { description: "List updated in real time." });
  });

  connection.on("TaskUpdated", () => {
    invalidate();
    toast.message("Task updated", { description: "Changes synced live." });
  });

  connection.on("TaskDeleted", () => {
    invalidate();
    toast.message("Task deleted", { description: "List updated in real time." });
  });

  let started = false;

  const start = async () => {
    if (started || !getToken()) return;
    try {
      await connection.start();
      await connection.invoke("Subscribe");
      started = true;
    } catch {
      // Backend may be offline during local startup; connection retries automatically.
    }
  };

  void start();

  return () => {
    started = false;
    void connection.stop();
  };
}
