import { Router } from "express";

function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

function validateCreate(body) {
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    throw httpError(400, "title is required");
  }
  if (body.title.trim().length > 120) {
    throw httpError(400, "title must be 120 characters or fewer");
  }
  if (body.description !== undefined && typeof body.description !== "string") {
    throw httpError(400, "description must be a string");
  }
  return {
    title: body.title.trim(),
    description: body.description?.trim() ?? "",
    completed: Boolean(body.completed),
  };
}

function validateUpdate(body) {
  const allowed = {};
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      throw httpError(400, "title cannot be empty");
    }
    allowed.title = body.title.trim();
  }
  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      throw httpError(400, "description must be a string");
    }
    allowed.description = body.description.trim();
  }
  if (body.completed !== undefined) {
    if (typeof body.completed !== "boolean") {
      throw httpError(400, "completed must be a boolean");
    }
    allowed.completed = body.completed;
  }
  if (Object.keys(allowed).length === 0) {
    throw httpError(400, "provide at least one editable field");
  }
  return allowed;
}

export function createTaskRouter(repository) {
  const router = Router();

  router.get("/", async (_request, response, next) => {
    try {
      response.json(await repository.list());
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      const task = await repository.create(validateCreate(request.body));
      response.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id", async (request, response, next) => {
    try {
      const task = await repository.update(request.params.id, validateUpdate(request.body));
      if (!task) throw httpError(404, "task not found");
      response.json(task);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (request, response, next) => {
    try {
      const task = await repository.delete(request.params.id);
      if (!task) throw httpError(404, "task not found");
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
