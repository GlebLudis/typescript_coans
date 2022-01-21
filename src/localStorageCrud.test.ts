import { LocalStorage, Task } from "./localStorageCrud"

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

const crudCalendar = new LocalStorage.Calendar();

describe("should work crud methods", () => {
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
  it("Calendar is a class", () => {
    expect(LocalStorage.Calendar).toBeInstanceOf(Function);
  });
  it("Create method is a function", () => {
    expect(crudCalendar.create).toBeInstanceOf(Function);
  });
  it("localStorage have calendar", async () => {
    expect(localStorage.getItem("Calendar")).toEqual(JSON.stringify([]));
  });
  it("create tasks", async () => {
    await crudCalendar.create(taskOne);
    await sleep(10);
    expect(localStorage.getItem("Calendar")).toEqual(
      JSON.stringify([taskOne])
    );
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
    expect(localStorage.getItem("Calendar")).toEqual(
      JSON.stringify([taskTwo])
    );
    expect(
      JSON.parse(localStorage.getItem("Calendar") as string).length
    ).toEqual(1);
  });
});

describe("filters is work", () => {
  it("filter by date", async () => {
    await sleep(10);
    const result = await crudCalendar.filterDate(new Date(2021, 8, 19));

    expect(result[0]).toEqual(
      JSON.parse(localStorage.getItem("Calendar") as string)[0]
    );
  });
  it("Must filter tasks by text", async () => {
    const taskThree: Task = {
      date: new Date(2021, 8, 19).toString(),
      text: "filter tasks by text",
      status: "in progress",
      tag: "high",
    };
    await crudCalendar.create(taskThree);
    const result = (await crudCalendar.filterText("filter tasks by text"))[0];

    expect(result).toEqual(
      JSON.parse(localStorage.getItem("Calendar") as string)[2]
    );
  });

  it("filter tag is work", async () => {
    const taskFour: Task = {
      date: new Date(2021, 8, 19).toString(),
      text: "filter tag is work",
      status: "in progress",
      tag: "high",
    };

    await crudCalendar.create(taskFour);
    const result = await crudCalendar.filterTag("high");

    expect(result).toEqual([
      JSON.parse(localStorage.getItem("Calendar") as string)[3],
    ]);
  });

  it("filter 'status' is work", async () => {
    const result = await crudCalendar.filterStatus("in progress");
    expect(result).toEqual([
      JSON.parse(localStorage.getItem("Calendar") as string)[0],
    ]);
  });
});
