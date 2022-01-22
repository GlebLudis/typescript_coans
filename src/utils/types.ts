export type Task = {
  date: string;
  text: string;
  status: "await" | "in progress" | "done";
  tag: "normal" | "high";
  id?: string | number;
  [key: string]: any;
};
