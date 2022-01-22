import { v4 as uuidv4 } from "uuid";
import { Task } from "./utils/types";
import { ICalendar } from "./utils/interface";

export namespace LocalStorage {
  export class Calendar implements ICalendar {
    tasks: Task["id"][] = [];

    storage: Task[] = [];

    uuidTask: Task["id"];

    constructor() {
      if (localStorage.getItem("Calendar") !== undefined) {
        this.storage = [];
        localStorage.setItem("Calendar", JSON.stringify(this.storage));
      }
      this.uuidTask = "";
    }

    async create(newTask: Task): Promise<Task[]> {
      this.storage.push(await this.createTask(newTask));
      this.tasks.push(this.storage[this.storage.length - 1].id);
      localStorage.setItem("Calendar", JSON.stringify(this.storage));
      return this.storage;
    }

    async read(id: Task["id"]): Promise<Task> {
      const result = [];
      for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].id === id) {
          result.push(this.storage[i]);
        }
      }
      return result[0];
    }

    async update(id: Task["id"], updateTask: Partial<Task>): Promise<Task> {
      const newTask = await this.read(id);
      for (const key in newTask) {
        if (updateTask[key]) {
          newTask[key] = updateTask[key];
        }
      }

      const storage = JSON.parse(localStorage.getItem("Calendar") as string);
      const newStorage = storage.map((item: Task) =>
        item.id === id ? newTask : item
      );
      localStorage.setItem("Calendar", JSON.stringify(newStorage));
      return newTask;
    }

    async delete(id: Task["id"]): Promise<void> {
      const newStorage = this.storage.filter((item: Task) => item.id !== id);
      localStorage.setItem("Calendar", JSON.stringify(newStorage));
      const newTasks = this.tasks.filter((item: Task["id"]) => item !== id);
      this.tasks = newTasks;
    }

    async createTask(task: Task): Promise<Task> {
      this.uuidTask = uuidv4();
      const newTask = task;
      newTask.id = this.uuidTask;
      return newTask;
    }

    async filterDate(filtredDate: Date): Promise<Task[]> {
      return this.storage.filter(
        (item: Task) =>
          JSON.stringify(item.date) === JSON.stringify(filtredDate.toString())
      );
    }

    async filterText(text: Task["text"]): Promise<Task[]> {
      return this.storage.filter((item: Task) => item.text === text);
    }

    async filterTag(tag: Task["tag"]): Promise<Task[]> {
      return this.storage.filter((item: Task) => item.tag === tag);
    }

    async filterStatus(status: Task["status"]): Promise<Task[]> {
      return this.storage.filter((item: Task) => item.status === status);
    }
  }
}
