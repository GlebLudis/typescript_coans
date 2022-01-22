export type Task = {
  date: string;
  text: string;
  status: "await" | "in progress" | "done";
  tag: "normal" | "high";
  id?: string | undefined
  [key: string]: any;
};

export interface ICalendar {
  tasks: Task["id"][] | string[];
  create(newTask: Task): Promise<Task[]>;
  read(id: Task["id"]): Promise<Task>;
  update(id: Task["id"], updateTask: Task): Promise<Task>;
  delete(id: Task["id"]): Promise<void>;
}
