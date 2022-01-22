import firebase from "firebase";
import {Task} from "./utils/types";
import {firebaseConfig} from "./utils/fireBaseConfig";

firebase.initializeApp(firebaseConfig);

export namespace FireBase {
  export class Calendar {
    tasksId: Task["id"][] = [];

    dataBase: firebase.database.Database;

    public fireBasePlace = "tasks";

    constructor(fireBasePlace?: string) {
      if (fireBasePlace === undefined) {
        this.fireBasePlace = "";
      }
      this.dataBase = firebase.database();
    }

    public async create(newTask: Task): Promise<Task[]> {
      const locateFireBase = this.dataBase.ref(this.fireBasePlace);
      locateFireBase.push(newTask);
      this.tasksId = Object.keys(await (await locateFireBase.get()).val());
      const tasks: Task[] = Object.values(
        await (await locateFireBase.get()).val()
      );
      return tasks;
    }

    public async read(id: string): Promise<Task> {
      const readTask: Task = await (
        await this.dataBase.ref(`${this.fireBasePlace}/${id}`).get()
      ).val();
      return readTask;
    }

    public async update(id: string, updateTask: Partial<Task>): Promise<Task> {
      const newTask = await this.read(id);

      for (const key in newTask) {
        if (updateTask[key]) {
          newTask[key] = updateTask[key];
        }
      }
      await this.dataBase.ref(`${this.fireBasePlace}/${id}`).set(newTask);
      return newTask;
    }

    public async delete(id: string): Promise<void> {
      await this.dataBase.ref(`${this.fireBasePlace}/${id}`).remove();
      this.tasksId = this.tasksId.filter((el) => el !== id);
    }

  }
}
