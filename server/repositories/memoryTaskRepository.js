import { randomUUID } from "node:crypto";

export class MemoryTaskRepository {
  constructor(initialTasks = []) {
    this.tasks = initialTasks.map((task) => ({ ...task }));
  }

  async list() {
    return this.tasks.map((task) => ({ ...task }));
  }

  async create(input) {
    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      title: input.title,
      description: input.description ?? "",
      completed: input.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.unshift(task);
    return { ...task };
  }

  async update(id, input) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;
    this.tasks[index] = {
      ...this.tasks[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;
    return this.tasks.splice(index, 1)[0];
  }
}
