import clientPromise from "./db";

export async function createUser(user) {
  const client = await clientPromise;
  const db = client.db("taskdb");
  const users = db.collection("users");
  const result = await users.insertOne(user);
  return result.insertedId;
}