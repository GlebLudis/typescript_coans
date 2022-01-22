import firebase from "firebase";
import {FireBase} from "./fireBaseCrud";
import {Task} from "./utils/types";

const calendar = new FireBase.Calendar("newTasks");

beforeAll(async () => {
  await firebase.database().ref(calendar.fireBasePlace).remove();
});

describe("firebase is work", () => {
  const taskOne: Task = {
    date: new Date(2021, 5, 15).toString(),
    text: "firebase is work",
    status: "await",
    tag: "normal",
  };
  const taskTwo: Task = {
    date: new Date(2021, 8, 19).toString(),
    text: "test message",
    status: "in progress",
    tag: "high",
  };
  it("create is work", async () => {
    const result = await calendar.create(taskOne);
    expect(result).toEqual([taskOne]);
    const result2 = await calendar.create(taskTwo);
    expect(result2).toEqual([taskOne, taskTwo]);
  });
  it("read is work", async () => {
    const result = await calendar.read(calendar.tasksId[1] as string);
    expect(result).toEqual(taskTwo);
  });
  it("update is work", async () => {
    await calendar.update(calendar.tasksId[1] as string, {
      status: "await",
    });
    const resultTask = calendar.read(calendar.tasksId[1] as string);
    expect((await resultTask).status).toBe("await");
  });

  it("delete is work", async () => {
    await calendar.delete(calendar.tasksId[1] as string);
    const locateFireBase = calendar.dataBase.ref(
      calendar.fireBasePlace
    );
    const tasks: Task[] = Object.values(
      await (await locateFireBase.get()).val()
    );
    expect(tasks).toEqual([taskOne]);
    expect(tasks.length).toEqual(1);
    expect(calendar.tasksId).not.toBeNull();
  });
});
