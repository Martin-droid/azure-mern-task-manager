import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import request from "supertest";

import { createApp } from "../server/app.js";
import { MemoryTaskRepository } from "../server/repositories/memoryTaskRepository.js";

describe("task API", () => {
  let app;

  beforeEach(() => {
    app = createApp(new MemoryTaskRepository());
  });

  it("reports service health", async () => {
    const response = await request(app).get("/api/health").expect(200);
    assert.deepEqual(response.body, { status: "ok" });
  });

  it("creates and lists a task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Deploy application", description: "Verify Azure health endpoint" })
      .expect(201);

    assert.equal(created.body.title, "Deploy application");
    assert.equal(created.body.completed, false);

    const list = await request(app).get("/api/tasks").expect(200);
    assert.equal(list.body.length, 1);
    assert.equal(list.body[0].id, created.body.id);
  });

  it("rejects invalid task input", async () => {
    const response = await request(app).post("/api/tasks").send({ title: "  " }).expect(400);
    assert.equal(response.body.error, "title is required");
  });

  it("updates completion state", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Test app" });
    const updated = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ completed: true })
      .expect(200);
    assert.equal(updated.body.completed, true);
  });

  it("deletes a task", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Temporary" });
    await request(app).delete(`/api/tasks/${created.body.id}`).expect(204);
    const list = await request(app).get("/api/tasks").expect(200);
    assert.deepEqual(list.body, []);
  });

  it("returns 404 for missing tasks", async () => {
    await request(app).patch("/api/tasks/missing").send({ completed: true }).expect(404);
    await request(app).delete("/api/tasks/missing").expect(404);
  });
});
