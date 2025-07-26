import clientPromise from "./db";

export async function createTask(task) {
  const client = await clientPromise;
  const db = client.db("taskdb");
  const tasks = db.collection("tasks");
  const result = await tasks.insertOne(task);
  return result.insertedId;
}

export async function getTasks() {
  const client = await clientPromise;
  const db = client.db("taskdb");
  const tasks = db.collection("tasks");
  return await tasks.find({}).toArray();
}