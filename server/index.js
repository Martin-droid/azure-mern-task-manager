import "dotenv/config";

import mongoose from "mongoose";

import { createApp } from "./app.js";
import { MongoTaskRepository } from "./repositories/mongoTaskRepository.js";

const port = Number(process.env.PORT || 5000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is required");
}

await mongoose.connect(mongoUri);

const app = createApp(new MongoTaskRepository());
const server = app.listen(port, () => {
  console.log(`Task Manager listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
