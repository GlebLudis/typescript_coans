import { Task } from "./utils/types";
import { LocalStorage } from "./localStorageCrud";

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

const crudCalendar = new LocalStorage.Calendar();

const taskOne: Task = {
  date: new Date(2021, 5, 15).toString(),
  text: "test 1",
  status: "await",
  tag: "normal",
};
const taskTwo: Task = {
  date: new Date(2021, 8, 19).toString(),
  text: "test 2",
  status: "in progress",
  tag: "high",
};

describe("should work crud methods", () => {
  it("Calendar is a class", () => {
    expect(LocalStorage.Calendar).toBeInstanceOf(Function);
  });
  it("Create method is a function", () => {
    expect(crudCalendar.create).toBeInstanceOf(Function);
  });
  it("localStorage have empty Calendar", async () => {
    expect(localStorage.getItem("Calendar")).toEqual(JSON.stringify([]));
  });
  it("create tasks", async () => {
    await crudCalendar.create(taskOne);
    await sleep(10);
    expect(localStorage.getItem("Calendar")).toEqual(JSON.stringify([taskOne]));
    await crudCalendar.create(taskTwo);
    await sleep(10);
    expect(localStorage.getItem("Calendar")).toEqual(
      JSON.stringify([taskOne, taskTwo])
    );
  });
  it("read function is work", async () => {
    const result = await crudCalendar.read(crudCalendar.tasks[0]);
    expect(result).toEqual(
      JSON.parse(localStorage.getItem("Calendar") as string)[0]
    );
  });
  it("update function is work", async () => {
    await crudCalendar.update(crudCalendar.tasks[0], { status: "in progress" });

    const resultTask = await crudCalendar.read(crudCalendar.tasks[0]);

    expect(resultTask.status).toBe("in progress");
  });
  it("delete function is work", async () => {
    expect(
      JSON.parse(localStorage.getItem("Calendar") as string).length
    ).toEqual(2);
    const delTask = crudCalendar.tasks[0];
    await crudCalendar.delete(delTask);
    expect(localStorage.getItem("Calendar")).toEqual(JSON.stringify([taskTwo]));
    expect(
      JSON.parse(localStorage.getItem("Calendar") as string).length
    ).toEqual(1);
  });
});

describe("filters is work", () => {
  it("filter by date", async () => {
    const result = await crudCalendar.filterDate(new Date(2021, 8, 19));

    expect(result[0]).toEqual(
      JSON.parse(localStorage.getItem("Calendar") as string)[0]
    );
  });
  it("Must filter tasks by text", async () => {
    await sleep(10);
    const result = (await crudCalendar.filterText("Test 1"))[2];

    expect(result).toEqual(
      JSON.parse(localStorage.getItem("Calendar") as string)[0]
    );
  });

  it("filter tag is work", async () => {
    await crudCalendar.create(taskOne);
    const result = await crudCalendar.filterTag("normal");

    expect(result).toEqual([
      JSON.parse(localStorage.getItem("Calendar") as string)[0],
    ]);
  });
});
