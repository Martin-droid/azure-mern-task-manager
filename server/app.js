import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createTaskRouter } from "./routes/tasks.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientBuild = path.resolve(currentDirectory, "../client/dist");

export function createApp(taskRepository) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "32kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/tasks", createTaskRouter(taskRepository));

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(clientBuild));
    app.get("/{*path}", (_request, response) => {
      response.sendFile(path.join(clientBuild, "index.html"));
    });
  }

  app.use((error, _request, response, _next) => {
    const status = error.status ?? 500;
    response.status(status).json({
      error: status === 500 ? "Internal server error" : error.message,
    });
  });

  return app;
}
