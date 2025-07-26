import clientPromise from "./db";

export async function loginUser(email, password, role) {
  const client = await clientPromise;
  const db = client.db("taskdb");
  const users = db.collection("users");
  const user = await users.findOne({ email, password, role });
  return user;
}