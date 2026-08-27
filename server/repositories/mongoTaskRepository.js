import { Task } from "../models/task.js";

export class MongoTaskRepository {
  async list() {
    return Task.find().sort({ createdAt: -1 });
  }

  async create(input) {
    return Task.create(input);
  }

  async update(id, input) {
    return Task.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return Task.findByIdAndDelete(id);
  }
}
